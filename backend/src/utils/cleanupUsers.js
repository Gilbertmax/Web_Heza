import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupUsers = async () => {
  const connection = await pool.getConnection();
  try {
    console.log('Starting user cleanup...');
    
    // Delete the test user (ID 3)
    console.log('Deleting test user with email: gilberto_gonzalez@heza.com.mx');
    const [deleteResult] = await connection.query(
      'DELETE FROM users WHERE email = ?',
      ['gilberto_gonzalez@heza.com.mx']
    );
    console.log(`Deleted ${deleteResult.affectedRows} test user(s)`);
    
    // Update admin ID from 2 to 1
    console.log('Updating admin ID from 2 to 1');
    const [updateResult] = await connection.query(
      'UPDATE users SET id = 1 WHERE id = 2'
    );
    console.log(`Updated ${updateResult.affectedRows} admin user(s)`);
    
    console.log('User cleanup completed successfully');
  } catch (error) {
    console.error('Error during user cleanup:', error);
  } finally {
    connection.release();
  }
};

cleanupUsers();