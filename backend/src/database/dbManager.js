import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Verifica la conexión a la base de datos y muestra información útil
 */
export async function checkDatabaseConnection() {
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
    // Intentar conectar a MySQL sin seleccionar una base de datos específica
    const rootConfig = {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    };
    
    let connection;
    try {
      connection = await mysql.createConnection(rootConfig);
      console.log('\n✅ Conexión a MySQL establecida correctamente');
    } catch (error) {
      console.error('\n❌ Error al conectar a MySQL:', error.message);
      
      if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log('\nSugerencia: Verifica que el usuario y contraseña de MySQL sean correctos en el archivo .env');
      } else if (error.code === 'ECONNREFUSED') {
        console.log('\nSugerencia: Verifica que el servidor MySQL esté en ejecución y accesible en la dirección y puerto especificados');
      }
      
      throw error;
    }
    
    // Verificar si la base de datos existe
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [dbConfig.database]);
    
    if (databases.length > 0) {
      console.log(`\n✅ Base de datos '${dbConfig.database}' encontrada`);
      
      // Seleccionar la base de datos
      await connection.query(`USE ${dbConfig.database}`);
      
      // Verificar tablas existentes
      const [tables] = await connection.query('SHOW TABLES');
      const tableCount = tables.length;
      
      if (tableCount > 0) {
        const tableNames = tables.map(table => Object.values(table)[0]).join(', ');
        console.log(`\n✅ Base de datos inicializada con ${tableCount} tablas: ${tableNames}`);
      } else {
        console.log(`\n⚠️ La base de datos '${dbConfig.database}' existe pero no contiene tablas`);
        console.log('Sugerencia: Ejecuta la migración para crear las tablas necesarias');
      }
    } else {
      console.log(`\n⚠️ Base de datos '${dbConfig.database}' no encontrada`);
      console.log('Sugerencia: Ejecuta la migración para crear la base de datos y sus tablas');
    }
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('Error durante la verificación de la base de datos:', error.message);
    return false;
  }
}

/**
 * Inicializa o migra la base de datos
 */
export async function migrateDatabase() {
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
      throw connError;
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
      throw dbError;
    }
    
    // Seleccionar la base de datos
    await connection.query(`USE ${dbName}`);
    
    // Verificar si la tabla users ya existe
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [dbName]);
    
    if (tables.length > 0) {
      console.log('La base de datos ya está configurada. Verificando tabla solicitudes_acceso...');
      
      // Ejecutar migración unificada
      console.log('Ejecutando migración unificada...');
      const migracionUnificadaPath = path.join(__dirname, 'migracion_unificada.sql');
      const migracionUnificadaSql = fs.readFileSync(migracionUnificadaPath, 'utf8');
      
      await connection.query(migracionUnificadaSql);
      console.log('Migración unificada ejecutada correctamente');
    } else {
      // Leer y ejecutar el archivo SQL de esquema
      const migracionPath = path.join(__dirname, 'migracion_unificada.sql');
      const migracionSql = fs.readFileSync(migracionPath, 'utf8');
      
      console.log('Ejecutando script de migración unificada...');
      await connection.query(migracionSql);
      console.log('Esquema de base de datos creado correctamente');
      
      // Verificar si se debe cargar datos de ejemplo
      const loadSampleData = process.env.LOAD_SAMPLE_DATA === 'true';
      
      if (loadSampleData) {
        // Leer y ejecutar el archivo SQL de datos de ejemplo
        const seedPath = path.join(__dirname, 'seed.sql');
        if (fs.existsSync(seedPath)) {
          const seedSql = fs.readFileSync(seedPath, 'utf8');
          
          console.log('Cargando datos de ejemplo...');
          await connection.query(seedSql);
          console.log('Datos de ejemplo cargados correctamente');
        } else {
          console.log('Archivo de datos de ejemplo no encontrado, omitiendo este paso');
        }
      }
    }
    
    await connection.end();
    console.log('Migración de base de datos completada con éxito');
    return true;
  } catch (error) {
    console.error('Error durante la migración de la base de datos:', error.message);
    return false;
  }
}

/**
 * Inicializa la base de datos (función principal que combina verificación y migración)
 */
export async function initializeDatabase() {
  console.log('\n=== INICIALIZACIÓN DE LA BASE DE DATOS ===\n');
  console.log('Entorno de ejecución:', process.env.NODE_ENV || 'development');
  
  try {
    // Paso 1: Verificar la conexión a la base de datos
    console.log('\nPaso 1: Verificando conexión a la base de datos...');
    await checkDatabaseConnection();
    
    // Paso 2: Ejecutar la migración de la base de datos
    console.log('\nPaso 2: Ejecutando migración de la base de datos...');
    await migrateDatabase();
    
    console.log('\n✅ Inicialización de la base de datos completada con éxito');
    console.log('La aplicación está lista para ser utilizada');
    return true;
  } catch (error) {
    console.error('\n❌ Error durante la inicialización de la base de datos:', error.message);
    return false;
  }
}

/**
 * Inspecciona la estructura de la base de datos y muestra información detallada
 */
export async function inspectDatabase() {
  console.log('Inspeccionando estructura de la base de datos...');
  
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'heza'
  };
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Conexión a MySQL establecida correctamente');
    
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n=== TABLAS EN LA BASE DE DATOS ===');
    
    if (tables.length === 0) {
      console.log('No se encontraron tablas en la base de datos.');
    } else {
      const tableNames = tables.map(table => Object.values(table)[0]);
      console.log(`Tablas encontradas (${tableNames.length}): ${tableNames.join(', ')}`);
      
      for (const tableName of tableNames) {
        console.log(`\n=== ESTRUCTURA DE LA TABLA: ${tableName} ===`);
        const [columns] = await connection.query(`DESCRIBE ${tableName}`);
        
        console.table(columns.map(col => ({
          Field: col.Field,
          Type: col.Type,
          Null: col.Null,
          Key: col.Key,
          Default: col.Default,
          Extra: col.Extra
        })));
        
        const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const count = countResult[0].count;
        console.log(`Total de registros en ${tableName}: ${count}`);
        
        if (count > 0) {
          const [sampleData] = await connection.query(`SELECT * FROM ${tableName} LIMIT 3`);
          console.log(`\nEjemplo de datos en ${tableName}:`);
          console.table(sampleData);
        }
      }
    }
    
    await connection.end();
    console.log('\nInspección de la base de datos completada');
    return true;
  } catch (error) {
    console.error('Error al inspeccionar la base de datos:', error.message);
    return false;
  }
}

// Exportar la función principal como default
export default initializeDatabase;