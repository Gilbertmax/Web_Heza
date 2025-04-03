import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log('Iniciando configuración de la base de datos...');
  
  const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
  } = process.env;
  
  // Extraer host y puerto
  const [host, port] = DB_HOST.split(':');
  
  try {
    // Primero conectar sin especificar base de datos
    const connection = await mysql.createConnection({
      host,
      port: port || 3306,
      user: DB_USER,
      password: DB_PASSWORD
    });
    
    console.log('Conexión establecida con MySQL');
    
    // Crear base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`Base de datos '${DB_NAME}' creada o verificada`);
    
    // Usar la base de datos
    await connection.query(`USE ${DB_NAME}`);
    
    // Verificar si la tabla users ya existe
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [DB_NAME]);
    
    // Si la tabla users ya existe, asumimos que la base de datos ya está configurada
    if (tables.length > 0) {
      console.log('La base de datos ya está configurada. Omitiendo la creación de tablas.');
      await connection.end();
      return;
    }
    
    // Leer el archivo schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Dividir el archivo en consultas individuales
    const queries = schemaSql
      .split(';')
      .filter(query => query.trim() !== '')
      .map(query => query + ';');
    
    // Ejecutar cada consulta
    for (const query of queries) {
      await connection.query(query);
    }
    
    console.log('Esquema de base de datos creado correctamente');
    
    // Cerrar conexión
    await connection.end();
    console.log('Configuración de base de datos completada');
    
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Ejecutar la función si este archivo se ejecuta directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase();
}

export default initializeDatabase;