import pool from '../config/db.js';
import bcrypt from 'bcrypt';

class User {
  static async create(userData) {
    const connection = await pool.getConnection();
    try {
      if (userData.password) {
        let firstHash = await bcrypt.hash(userData.password, 10);
        userData.password = await bcrypt.hash(firstHash, 12);
      }
      
      if (userData.email) {
        userData.original_email = userData.email;
      }
      
      const [result] = await connection.query(
        'INSERT INTO users SET ?', 
        userData
      );
      
      if (userData.rol === 'cliente' && userData.empresa) {
        const clienteData = {
          id: result.insertId,
          empresa: userData.empresa,
          rfc: userData.rfc || null,
          direccion: userData.direccion || null,
          ciudad: userData.ciudad || null,
          estado: userData.estado || null,
          codigo_postal: userData.codigo_postal || null,
          giro: userData.giro || null,
          numero_empleados: userData.numero_empleados || null,
          ventas_anuales: userData.ventas_anuales || null
        };
        
        await connection.query('INSERT INTO clientes SET ?', clienteData);
      }
      
      if (userData.rol === 'empleado' && userData.puesto) {
        const empleadoData = {
          id: result.insertId,
          puesto: userData.puesto,
          departamento: userData.departamento || null,
          fecha_contratacion: userData.fecha_contratacion || new Date()
        };
        
        await connection.query('INSERT INTO empleados SET ?', empleadoData);
      }
      
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  // Make sure the findByEmail method is working correctly
  static async findByEmail(email) {
    try {
      const connection = await pool.getConnection();
      try {
        console.log(`Finding user by email: ${email}`);
        const [rows] = await connection.query(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );
        
        console.log(`Found ${rows.length} users with email ${email}`);
        return rows[0] || null;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE id = ?', 
        [id]
      );
      
      if (!rows[0]) return null;
      
      const user = rows[0];
      
      if (user.rol === 'cliente') {
        const [clientRows] = await connection.query(
          'SELECT * FROM clientes WHERE id = ?',
          [id]
        );
        if (clientRows[0]) {
          // This is already using Object.assign which is good
          Object.assign(user, clientRows[0]);
        }
      }
      
      if (user.rol === 'empleado') {
        const [empRows] = await connection.query(
          'SELECT * FROM empleados WHERE id = ?',
          [id]
        );
        if (empRows[0]) {
          Object.assign(user, empRows[0]);
        }
      }
      
      return user;
    } finally {
      connection.release();
    }
  }
  
  static async update(id, userData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      
      const userFields = {};
      ['nombre', 'email', 'password', 'telefono', 'rol', 'activo'].forEach(field => {
        if (userData[field] !== undefined) {
          userFields[field] = userData[field];
        }
      });
      
      if (Object.keys(userFields).length > 0) {
        await connection.query(
          'UPDATE users SET ? WHERE id = ?',
          [userFields, id]
        );
      }
      
      if (userData.rol === 'cliente' || await this.isClient(id, connection)) {
        const clientFields = {};
        ['empresa', 'rfc', 'direccion', 'ciudad', 'estado', 'codigo_postal', 'giro', 'numero_empleados', 'ventas_anuales'].forEach(field => {
          if (userData[field] !== undefined) {
            clientFields[field] = userData[field];
          }
        });
        
        if (Object.keys(clientFields).length > 0) {
          const [clientExists] = await connection.query(
            'SELECT 1 FROM clientes WHERE id = ?',
            [id]
          );
          
          if (clientExists.length > 0) {
            await connection.query(
              'UPDATE clientes SET ? WHERE id = ?',
              [clientFields, id]
            );
          } else {
            clientFields.id = id;
            await connection.query(
              'INSERT INTO clientes SET ?',
              clientFields
            );
          }
        }
      }
      
      if (userData.rol === 'empleado' || await this.isEmployee(id, connection)) {
        const empFields = {};
        ['puesto', 'departamento', 'fecha_contratacion'].forEach(field => {
          if (userData[field] !== undefined) {
            empFields[field] = userData[field];
          }
        });
        
        if (Object.keys(empFields).length > 0) {
          const [empExists] = await connection.query(
            'SELECT 1 FROM empleados WHERE id = ?',
            [id]
          );
          
          if (empExists.length > 0) {
            await connection.query(
              'UPDATE empleados SET ? WHERE id = ?',
              [empFields, id]
            );
          } else {
            empFields.id = id;
            await connection.query(
              'INSERT INTO empleados SET ?',
              empFields
            );
          }
        }
      }
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  static async isClient(id, conn) {
    const connection = conn || await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT rol FROM users WHERE id = ?',
        [id]
      );
      return rows.length > 0 && rows[0].rol === 'cliente';
    } finally {
      if (!conn) connection.release();
    }
  }
  
  static async isEmployee(id, conn) {
    const connection = conn || await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT rol FROM users WHERE id = ?',
        [id]
      );
      return rows.length > 0 && rows[0].rol === 'empleado';
    } finally {
      if (!conn) connection.release();
    }
  }
  
  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.query('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } finally {
      connection.release();
    }
  }
  
  static async getAll(filters = {}) {
    const connection = await pool.getConnection();
    try {
      let query = 'SELECT * FROM users';
      const queryParams = [];
      
      // Add filters
      if (Object.keys(filters).length > 0) {
        query += ' WHERE ';
        const filterConditions = [];
        
        if (filters.rol) {
          filterConditions.push('rol = ?');
          queryParams.push(filters.rol);
        }
        
        if (filters.activo !== undefined) {
          filterConditions.push('activo = ?');
          queryParams.push(filters.activo);
        }
        
        if (filters.search) {
          filterConditions.push('(nombre LIKE ? OR email LIKE ?)');
          queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
        }
        
        query += filterConditions.join(' AND ');
      }
      
      // Add ordering
      query += ' ORDER BY fecha_registro DESC';
      
      const [rows] = await connection.query(query, queryParams);
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findByResetToken(token) {
    const connection = await pool.getConnection();
    try {
      console.log(`Finding user by reset token: ${token}`);
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE reset_token = ?',
        [token]
      );
      console.log(`Found ${rows.length} users with reset token`);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }
}

export default User;