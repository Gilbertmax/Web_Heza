import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const inspectDatabase = async () => {
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
    
  } catch (error) {
    console.error('Error durante la inspección de la base de datos:', error);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\nLa base de datos especificada no existe. Necesitas crearla primero.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\nNo se pudo conectar al servidor MySQL. Verifica que el servidor esté en ejecución y que los datos de conexión sean correctos.');
    }
  }
};

inspectDatabase();