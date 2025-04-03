import pool from '../config/db.js';
import bcrypt from 'bcrypt';

class User {
  static async create(userData) {
    const connection = await pool.getConnection();
    try {
      // Hash password if provided
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      
      const [result] = await connection.query(
        'INSERT INTO users SET ?', 
        userData
      );
      
      // If this is a client, add to clients table
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
      
      // If this is an employee, add to employees table
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
  
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE id = ?', 
        [id]
      );
      
      if (!rows[0]) return null;
      
      const user = rows[0];
      
      // If user is a client, get client data
      if (user.rol === 'cliente') {
        const [clientRows] = await connection.query(
          'SELECT * FROM clientes WHERE id = ?',
          [id]
        );
        if (clientRows[0]) {
          Object.assign(user, clientRows[0]);
        }
      }
      
      // If user is an employee, get employee data
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
      // Start transaction
      await connection.beginTransaction();
      
      // If password is being updated, hash it
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      
      // Update users table
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
      
      // If user is a client, update client data
      if (userData.rol === 'cliente' || await this.isClient(id, connection)) {
        const clientFields = {};
        ['empresa', 'rfc', 'direccion', 'ciudad', 'estado', 'codigo_postal', 'giro', 'numero_empleados', 'ventas_anuales'].forEach(field => {
          if (userData[field] !== undefined) {
            clientFields[field] = userData[field];
          }
        });
        
        if (Object.keys(clientFields).length > 0) {
          // Check if client record exists
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
      
      // If user is an employee, update employee data
      if (userData.rol === 'empleado' || await this.isEmployee(id, connection)) {
        const empFields = {};
        ['puesto', 'departamento', 'fecha_contratacion'].forEach(field => {
          if (userData[field] !== undefined) {
            empFields[field] = userData[field];
          }
        });
        
        if (Object.keys(empFields).length > 0) {
          // Check if employee record exists
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
      
      // Commit transaction
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
}

export default User;