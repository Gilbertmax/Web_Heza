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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrateDatabase = async () => {
  console.log('Iniciando migración de base de datos...');
  console.log('Entorno de ejecución:', process.env.NODE_ENV || 'development');
  
  // Configuración de la base de datos desde variables de entorno
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    multipleStatements: true
  };
  
  console.log(`Conectando a MySQL en ${dbConfig.host}:${dbConfig.port} como ${dbConfig.user}...`);
  
  try {
    // Conectar a MySQL sin seleccionar una base de datos
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('Conexión a MySQL establecida correctamente');
    } catch (connError) {
      console.error('Error al conectar a MySQL:', connError.message);
      if (connError.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log('\nSugerencia: Verifica que el usuario y contraseña de MySQL sean correctos en el archivo .env');
      } else if (connError.code === 'ECONNREFUSED') {
        console.log('\nSugerencia: Verifica que el servidor MySQL esté en ejecución y accesible en la dirección y puerto especificados');
      }
      process.exit(1);
    }
    
    // Crear la base de datos si no existe
    const dbName = process.env.DB_NAME || 'heza';
    try {
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`Base de datos '${dbName}' creada o verificada`);
    } catch (dbError) {
      console.error(`Error al crear la base de datos '${dbName}':`, dbError.message);
      console.log('\nSugerencia: Verifica que el usuario MySQL tenga permisos para crear bases de datos');
      await connection.end();
      process.exit(1);
    }
    
    // Seleccionar la base de datos
    await connection.query(`USE ${dbName}`);
    
    // Leer y ejecutar el archivo SQL de esquema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Ejecutando script de esquema...');
    await connection.query(schemaSql);
    console.log('Esquema de base de datos creado correctamente');
    
    // Verificar si se debe cargar datos de ejemplo
    const loadSampleData = process.env.LOAD_SAMPLE_DATA === 'true';
    
    if (loadSampleData) {
      // Leer y ejecutar el archivo SQL de datos de ejemplo
      const seedPath = path.join(__dirname, '../database/seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        
        console.log('Cargando datos de ejemplo...');
        await connection.query(seedSql);
        console.log('Datos de ejemplo cargados correctamente');
      } else {
        console.log('Archivo de datos de ejemplo no encontrado, omitiendo este paso');
      }
    }
    
    await connection.end();
    console.log('Migración de base de datos completada con éxito');
    
  } catch (error) {
    console.error('Error durante la migración de la base de datos:', error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\nLa base de datos especificada no existe. Necesitas crearla primero.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\nNo se pudo conectar al servidor MySQL. Verifica que el servidor esté en ejecución y que los datos de conexión sean correctos.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nAcceso denegado. Verifica tu nombre de usuario y contraseña de MySQL.');
    } else if (error.code === 'ER_PARSE_ERROR') {
      console.log('\nError de sintaxis en el script SQL. Revisa los archivos schema.sql y seed.sql.');
    }
    
    console.log('\nPara solucionar este problema:');
    console.log('1. Verifica que el archivo .env exista y contenga la configuración correcta');
    console.log('2. Asegúrate de que el servidor MySQL esté en ejecución');
    console.log('3. Comprueba que los datos de conexión (host, puerto, usuario, contraseña) sean correctos');
    console.log('4. Verifica que el usuario tenga permisos suficientes para crear y modificar bases de datos');
    
    process.exit(1);
  }
};

// Ejecutar la migración si este archivo se ejecuta directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrateDatabase();
}

export default migrateDatabase;