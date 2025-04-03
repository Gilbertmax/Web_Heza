import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function updateAdminPassword() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const plainPassword = 'es3Hm3f9y&CdoxVcLruS@VCurrent';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log('New hashed password:', hashedPassword);
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, 'AdminHeza']
    );
    
    console.log('Admin password updated successfully');
    
    await connection.end();
    
  } catch (error) {
    console.error('Error updating admin password:', error);
  }
}

updateAdminPassword();