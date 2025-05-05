/**
 * Script para verificar la estructura de la base de datos sin necesidad de MySQL instalado
 * Este script utiliza el módulo dbManager.js para conectarse a la base de datos
 * y verificar que todas las tablas y campos existan correctamente.
 */

import { checkDatabaseConnection } from './dbManager.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Función principal para verificar la estructura de la base de datos
 */
async function verificarEstructura() {
  console.log('\n=== VERIFICACIÓN DE ESTRUCTURA DE LA BASE DE DATOS ===\n');
  
  // Primero verificamos la conexión
  await checkDatabaseConnection();
  
  // Configuración de la base de datos desde variables de entorno
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'heza'
  };
  
  let connection;
  
  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión establecida correctamente');
    
    // Verificar tablas existentes
    console.log('\n📋 VERIFICANDO TABLAS EXISTENTES:\n');
    const [tables] = await connection.query('SHOW TABLES');
    
    // Convertir el resultado a un array simple de nombres de tablas
    const tableNames = tables.map(table => Object.values(table)[0]);
    console.log(tableNames);
    
    // Lista de tablas que deberían existir según migracion_unificada.sql
    const requiredTables = [
      'users', 'clientes', 'servicios', 'eventos', 'empleados',
      'categorias_documentos', 'cliente_servicio', 'diagnosticos',
      'documentos', 'mensajes', 'galeria_eventos', 'solicitudes_acceso',
      'noticias', 'sucursales'
    ];
    
    // Verificar cada tabla requerida
    let allTablesExist = true;
    for (const tableName of requiredTables) {
      if (tableNames.includes(tableName)) {
        console.log(`✅ Tabla ${tableName} existe`);
        
        // Verificar estructura de la tabla
        const [columns] = await connection.query(`DESCRIBE ${tableName}`);
        console.log(`   - Columnas: ${columns.length}`);
      } else {
        console.log(`❌ Tabla ${tableName} NO existe`);
        allTablesExist = false;
      }
    }
    
    // Resultado final
    console.log('\n=== RESULTADO DE LA VERIFICACIÓN ===\n');
    if (allTablesExist) {
      console.log('✅ TODAS LAS TABLAS EXISTEN CORRECTAMENTE');
      console.log('\nPara verificar la estructura completa, ejecuta en MySQL:');
      console.log('USE heza;');
      console.log('CALL verificar_estructura();');
    } else {
      console.log('❌ FALTAN ALGUNAS TABLAS. SE RECOMIENDA EJECUTAR LA MIGRACIÓN COMPLETA');
      console.log('\nPara ejecutar la migración completa:');
      console.log('1. Asegúrate de tener MySQL instalado y configurado');
      console.log('2. Ejecuta: mysql -u [usuario] -p < migracion_unificada.sql');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR AL VERIFICAR LA ESTRUCTURA DE LA BASE DE DATOS:\n', error);
    console.log('\nPosibles soluciones:');
    console.log('1. Verifica que las credenciales de la base de datos sean correctas en el archivo .env');
    console.log('2. Asegúrate de que el servidor MySQL esté en ejecución');
    console.log('3. Verifica que la base de datos "heza" exista');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nConexión cerrada.');
    }
  }
}

// Ejecutar la función principal
verificarEstructura().catch(console.error);