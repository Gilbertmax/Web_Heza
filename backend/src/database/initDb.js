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
    DB_NAME,
    DB_PORT
  } = process.env;
  
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      port: DB_PORT || 3306,
      user: DB_USER,
      password: DB_PASSWORD
    });
    
    console.log('Conexión establecida con MySQL');
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`Base de datos '${DB_NAME}' creada o verificada`);
    
    await connection.query(`USE ${DB_NAME}`);
    
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [DB_NAME]);
    
    if (tables.length > 0) {
      console.log('La base de datos ya está configurada. Omitiendo la creación de tablas.');
      await connection.end();
      return;
    }
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    const queries = schemaSql
      .split(';')
      .filter(query => query.trim() !== '')
      .map(query => query + ';');
    
    for (const query of queries) {
      await connection.query(query);
    }
    
    console.log('Esquema de base de datos creado correctamente');
    
    await connection.end();
    console.log('Configuración de base de datos completada');
    
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase();
}

export default initializeDatabase;