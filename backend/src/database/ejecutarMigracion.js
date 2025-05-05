/**
 * Script para ejecutar la migración unificada desde Node.js
 * Este script permite aplicar la migración completa sin necesidad de usar
 * comandos MySQL directamente desde la terminal.
 */

import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Función principal para ejecutar la migración
 */
async function ejecutarMigracion() {
  console.log('\n=== EJECUTANDO MIGRACIÓN UNIFICADA DE LA BASE DE DATOS ===\n');
  
  // Configuración de la base de datos desde variables de entorno
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    multipleStatements: true // Importante para ejecutar múltiples consultas
  };
  
  let connection;
  
  try {
    // Leer el archivo de migración
    const migracionPath = path.join(__dirname, 'migracion_unificada.sql');
    const sqlContent = await fs.readFile(migracionPath, 'utf8');
    
    console.log('✅ Archivo de migración leído correctamente');
    console.log(`📂 Ruta: ${migracionPath}`);
    console.log(`📊 Tamaño: ${(sqlContent.length / 1024).toFixed(2)} KB`);
    
    // Conectar a MySQL (sin seleccionar base de datos)
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión a MySQL establecida');
    
    // Ejecutar el script completo
    console.log('\n🔄 Ejecutando migración...');
    await connection.query(sqlContent);
    
    console.log('\n✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('\nPara verificar la estructura, ejecuta:');
    console.log('node verificarMigracion.js');
    
  } catch (error) {
    console.error('\n❌ ERROR AL EJECUTAR LA MIGRACIÓN:\n', error);
    console.log('\nPosibles soluciones:');
    console.log('1. Verifica que las credenciales de la base de datos sean correctas en el archivo .env');
    console.log('2. Asegúrate de que el servidor MySQL esté en ejecución');
    console.log('3. Revisa el archivo de migración en busca de errores de sintaxis');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nConexión cerrada.');
    }
  }
}

// Ejecutar la función principal
ejecutarMigracion().catch(console.error);