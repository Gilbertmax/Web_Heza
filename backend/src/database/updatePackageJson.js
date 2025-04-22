/**
 * Script para actualizar el archivo package.json con los nuevos comandos de base de datos
 * Ejecutar con: node src/database/updatePackageJson.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo package.json
const packageJsonPath = path.resolve(__dirname, '../../../package.json');

async function updatePackageJson() {
  console.log('Actualizando package.json con los nuevos comandos de base de datos...');
  
  try {
    // Leer el archivo package.json
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Comandos de base de datos a agregar
    const dbScripts = {
      'db:init': 'node src/database/dbScript.js init',
      'db:check': 'node src/database/dbScript.js check',
      'db:migrate': 'node src/database/dbScript.js migrate',
      'db:inspect': 'node src/database/dbScript.js inspect'
    };
    
    // Verificar si ya existen los comandos
    let scriptsUpdated = false;
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    // Agregar o actualizar los comandos
    for (const [scriptName, scriptCommand] of Object.entries(dbScripts)) {
      if (packageJson.scripts[scriptName] !== scriptCommand) {
        packageJson.scripts[scriptName] = scriptCommand;
        scriptsUpdated = true;
      }
    }
    
    if (scriptsUpdated) {
      // Guardar el archivo package.json actualizado
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + '\n',
        'utf8'
      );
      
      console.log('✅ package.json actualizado correctamente con los nuevos comandos:');
      for (const [scriptName, scriptCommand] of Object.entries(dbScripts)) {
        console.log(`  - ${scriptName}: ${scriptCommand}`);
      }
      
      console.log('\nAhora puedes usar estos comandos, por ejemplo:');
      console.log('  npm run db:init     # Inicializar la base de datos');
      console.log('  npm run db:check    # Verificar la conexión');
      console.log('  npm run db:migrate  # Ejecutar la migración');
      console.log('  npm run db:inspect  # Inspeccionar la estructura');
    } else {
      console.log('ℹ️ Los comandos ya estaban actualizados en package.json');
    }
  } catch (error) {
    console.error('❌ Error al actualizar package.json:', error.message);
    if (error.code === 'ENOENT') {
      console.error(`El archivo package.json no se encontró en: ${packageJsonPath}`);
    }
  }
}

// Ejecutar la función si este archivo se ejecuta directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updatePackageJson();
}

export default updatePackageJson;