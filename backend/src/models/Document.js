import pool from '../config/db.js';

class Document {
  static async create(documentData) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO documentos SET ?', 
        documentData
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }
  
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT d.*, c.nombre as categoria_nombre 
         FROM documentos d
         LEFT JOIN categorias_documentos c ON d.id_categoria = c.id
         WHERE d.id = ?`, 
        [id]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  }
  
  static async update(id, documentData) {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'UPDATE documentos SET ? WHERE id = ?',
        [documentData, id]
      );
      return true;
    } finally {
      connection.release();
    }
  }
  
  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.query('DELETE FROM documentos WHERE id = ?', [id]);
      return true;
    } finally {
      connection.release();
    }
  }
  
  static async getByClient(clientId, filters = {}) {
    const connection = await pool.getConnection();
    try {
      let query = `
        SELECT d.*, c.nombre as categoria_nombre 
        FROM documentos d
        LEFT JOIN categorias_documentos c ON d.id_categoria = c.id
        WHERE d.id_cliente = ?
      `;
      
      const queryParams = [clientId];
      
      if (filters.categoria) {
        query += ' AND d.id_categoria = ?';
        queryParams.push(filters.categoria);
      }
      
      if (filters.search) {
        query += ' AND (d.nombre LIKE ? OR d.descripcion LIKE ?)';
        queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
      }
      
      if (filters.fecha_desde) {
        query += ' AND d.fecha_subida >= ?';
        queryParams.push(filters.fecha_desde);
      }
      
      if (filters.fecha_hasta) {
        query += ' AND d.fecha_subida <= ?';
        queryParams.push(filters.fecha_hasta);
      }
      
      query += ' ORDER BY d.fecha_subida DESC';
      
      const [rows] = await connection.query(query, queryParams);
      return rows;
    } finally {
      connection.release();
    }
  }
  
  static async getCategories() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM categorias_documentos');
      return rows;
    } finally {
      connection.release();
    }
  }
}

export default Document;