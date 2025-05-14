/**
 * Script para inicializar la base de datos en un nuevo entorno
 * Este script combina la verificación y migración en un solo paso
 * Ejecutar con: node src/utils/initializeDatabase.js
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import migrateDatabase from './migrateDatabase.js';
import checkDatabaseConnection from './checkDatabaseConnection.js';

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
    
    // Verificar si existe .env.example y crear .env a partir de él
    const exampleEnvPath = path.resolve(__dirname, '../../../.env.example');
    if (fs.existsSync(exampleEnvPath)) {
      console.log('Se encontró .env.example, creando archivo .env con valores predeterminados...');
      fs.copyFileSync(exampleEnvPath, path.resolve(__dirname, '../../../.env'));
      console.log('Archivo .env creado con éxito a partir de .env.example');
      dotenv.config();
    } else {
      console.warn('No se encontró archivo .env.example para crear .env automáticamente');
    }
  }
}

const initializeDatabase = async () => {
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
  } catch (error) {
    console.error('\n❌ Error durante la inicialización de la base de datos:', error.message);
    process.exit(1);
  }
};

// Ejecutar la inicialización si este archivo se ejecuta directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase();
}

export default initializeDatabase;