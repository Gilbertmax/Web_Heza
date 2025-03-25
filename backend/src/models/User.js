class User {
    static async create(userData) {
      const connection = await pool.getConnection();
      try {
        const [result] = await connection.query(
          'INSERT INTO users SET ?', 
          userData
        );
        return result.insertId;
      } finally {
        connection.release();
      }
    }
  
    static async findByEmail(email) {
      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.query(
          'SELECT * FROM users WHERE email = ?', 
          [email]
        );
        return rows[0];
      } finally {
        connection.release();
      }
    }
  }
  
  export default User;