import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { checkDatabaseConnection } from '../database/dbManager.js';

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

// Determinar el entorno de ejecución
const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`Entorno de ejecución: ${nodeEnv}`);

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'heza',
  waitForConnections: true,
  connectionLimit: nodeEnv === 'production' ? 20 : 10,
  queueLimit: 0
};

// Crear el pool de conexiones
const pool = mysql.createPool(dbConfig);

// Probar la conexión a la base de datos
pool.getConnection()
  .then(connection => {
    console.log(`Conexión a la base de datos '${dbConfig.database}' establecida correctamente en ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err.message);
    
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nSugerencia: Verifica que el usuario y contraseña de MySQL sean correctos en el archivo .env');
    } else if (err.code === 'ECONNREFUSED') {
      console.log('\nSugerencia: Verifica que el servidor MySQL esté en ejecución y accesible en la dirección y puerto especificados');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.log(`\nLa base de datos '${dbConfig.database}' no existe. Ejecuta 'npm run db:init' o 'npm run db:migrate' para crearla.`);
    }
    
    // En producción, un error de conexión a la base de datos es crítico
    if (nodeEnv === 'production') {
      console.error('Error crítico: No se pudo conectar a la base de datos en entorno de producción');
      process.exit(1);
    }
  });

// Nota: Para una gestión más completa de la base de datos, utiliza los scripts en la carpeta database:
// - Para inicializar la base de datos: npm run db:init
// - Para verificar la conexión: npm run db:check
// - Para ejecutar migraciones: npm run db:migrate
// - Para inspeccionar la estructura: npm run db:inspect

export default pool;