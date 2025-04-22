/**
 * Script para verificar la conexión a la base de datos y mostrar información útil
 * Ejecutar con: node src/utils/checkDatabaseConnection.js
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

// Cargar variables de entorno desde .env
// Primero intentamos cargar desde la raíz del proyecto
let envLoaded = dotenv.config();

// Si no se encuentra el archivo .env en la raíz, intentamos buscarlo en el directorio actual
if (envLoaded.error) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.resolve(__dirname, '../../../.env');
  
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Variables de entorno cargadas desde: ${envPath}`);
  } else {
    console.warn('Archivo .env no encontrado. Usando valores predeterminados.');
  }
}

const checkDatabaseConnection = async () => {
  console.log('\n=== VERIFICACIÓN DE CONEXIÓN A LA BASE DE DATOS ===\n');
  
  // Mostrar información del entorno
  console.log('INFORMACIÓN DEL ENTORNO:');
  console.log(`- Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`- Directorio actual: ${process.cwd()}`);
  console.log('\nCONFIGURACIÓN DE LA BASE DE DATOS:');
  
  // Configuración de la base de datos desde variables de entorno
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'heza'
  };
  
  // Mostrar configuración (ocultando la contraseña completa)
  const maskedPassword = dbConfig.password ? '*'.repeat(dbConfig.password.length) : 'no configurada';
  console.log(`- Host: ${dbConfig.host}`);
  console.log(`- Puerto: ${dbConfig.port}`);
  console.log(`- Usuario: ${dbConfig.user}`);
  console.log(`- Contraseña: ${maskedPassword}`);
  console.log(`- Base de datos: ${dbConfig.database}`);
  
  try {
    // Intentar conectar sin la base de datos primero
    const connectionConfig = { ...dbConfig };
    delete connectionConfig.database;
    
    console.log('\nPRUEBA DE CONEXIÓN AL SERVIDOR MYSQL:');
    console.log(`Intentando conectar a MySQL en ${dbConfig.host}:${dbConfig.port}...`);
    
    try {
      const serverConnection = await mysql.createConnection(connectionConfig);
      console.log('✅ Conexión al servidor MySQL establecida correctamente');
      
      // Verificar si la base de datos existe
      console.log(`\nVERIFICANDO BASE DE DATOS '${dbConfig.database}':`);
      const [rows] = await serverConnection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, 
        [dbConfig.database]
      );
      
      if (rows.length > 0) {
        console.log(`✅ La base de datos '${dbConfig.database}' existe`);
        
        // Intentar conectar a la base de datos específica
        try {
          const dbConnection = await mysql.createConnection(dbConfig);
          console.log(`✅ Conexión a la base de datos '${dbConfig.database}' establecida correctamente`);
          
          // Verificar tablas
          console.log('\nVERIFICANDO TABLAS:');
          const [tables] = await dbConnection.query(
            `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
            [dbConfig.database]
          );
          
          if (tables.length > 0) {
            console.log(`✅ Se encontraron ${tables.length} tablas en la base de datos:`);
            tables.forEach(table => {
              console.log(`  - ${table.TABLE_NAME}`);
            });
          } else {
            console.log(`⚠️ No se encontraron tablas en la base de datos '${dbConfig.database}'`);
            console.log('   Sugerencia: Ejecuta "npm run migrate" para crear las tablas');
          }
          
          await dbConnection.end();
        } catch (dbConnError) {
          console.log(`❌ Error al conectar a la base de datos '${dbConfig.database}':`, dbConnError.message);
        }
      } else {
        console.log(`❌ La base de datos '${dbConfig.database}' no existe`);
        console.log('   Sugerencia: Ejecuta "npm run migrate" para crear la base de datos');
      }
      
      await serverConnection.end();
    } catch (serverConnError) {
      console.log('❌ Error al conectar al servidor MySQL:', serverConnError.message);
      
      if (serverConnError.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log('   Sugerencia: Verifica que el usuario y contraseña de MySQL sean correctos en el archivo .env');
      } else if (serverConnError.code === 'ECONNREFUSED') {
        console.log('   Sugerencia: Verifica que el servidor MySQL esté en ejecución y accesible en la dirección y puerto especificados');
      }
    }
  } catch (error) {
    console.error('Error durante la verificación:', error.message);
  }
  
  console.log('\n=== FIN DE LA VERIFICACIÓN ===');
};

// Ejecutar la verificación si este archivo se ejecuta directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkDatabaseConnection();
}

export default checkDatabaseConnection;