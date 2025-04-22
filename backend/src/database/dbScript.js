/**
 * Script ejecutable para gestionar la base de datos
 * Este archivo proporciona una interfaz de línea de comandos para utilizar
 * las funciones del módulo centralizado de base de datos.
 */

import { initializeDatabase, checkDatabaseConnection, migrateDatabase, inspectDatabase } from './dbManager.js';

// Obtener argumentos de la línea de comandos
const args = process.argv.slice(2);
const command = args[0];

// Función principal
async function main() {
  console.log('=== HERRAMIENTA DE GESTIÓN DE BASE DE DATOS HEZA ===');
  
  if (!command) {
    showHelp();
    return;
  }
  
  try {
    switch (command) {
      case 'init':
      case 'initialize':
        await initializeDatabase();
        break;
        
      case 'check':
      case 'verify':
        await checkDatabaseConnection();
        break;
        
      case 'migrate':
        await migrateDatabase();
        break;
        
      case 'inspect':
        await inspectDatabase();
        break;
        
      case 'help':
        showHelp();
        break;
        
      default:
        console.error(`Comando desconocido: ${command}`);
        showHelp();
        break;
    }
  } catch (error) {
    console.error('Error al ejecutar el comando:', error.message);
    process.exit(1);
  }
}

// Mostrar ayuda
function showHelp() {
  console.log(`
Uso: node dbScript.js [comando]

Comandos disponibles:
  init, initialize  - Inicializa la base de datos (verifica conexión y ejecuta migración)
  check, verify     - Verifica la conexión a la base de datos
  migrate           - Ejecuta la migración de la base de datos
  inspect           - Inspecciona la estructura de la base de datos
  help              - Muestra esta ayuda
`);
}

// Ejecutar la función principal
main().catch(error => {
  console.error('Error inesperado:', error);
  process.exit(1);
});