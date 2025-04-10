import pool from '../config/db.js';

class News {
  static async create(newsData) {
    const connection = await pool.getConnection();
    try {
      const insertData = {
        titulo: (newsData.titulo || '').substring(0, 255),
        contenido: newsData.contenido || '',
        fecha: newsData.fecha || new Date().toISOString().split('T')[0],
        imagen: newsData.imagen || null,
        imagenes: newsData.imagenes ? JSON.stringify(newsData.imagenes) : null
      };
  
      
      const [result] = await connection.query(
        'INSERT INTO noticias SET ?',
        insertData
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Database Failure:', error.sqlMessage);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAll() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM noticias ORDER BY fecha DESC');
      
      return rows.map(row => {
        if (row.imagenes && typeof row.imagenes === 'string') {
          try {
            row.imagenes = JSON.parse(row.imagenes);
          } catch (e) {
            console.error('Error parsing imagenes JSON:', e);
            row.imagenes = [];
          }
        } else {
          row.imagenes = [];
        }
        return row;
      });
    } catch (error) {
      console.error('Error getting all news:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(id, newsData) {
    const connection = await pool.getConnection();
    try {
      if (newsData.imagenes && Array.isArray(newsData.imagenes)) {
        newsData.imagenes = JSON.stringify(newsData.imagenes);
      }
      
      const query = `
        UPDATE noticias
        SET titulo = ?, contenido = ?, fecha = ?, imagen = ?, imagenes = ?
        WHERE id = ?
      `;
      
      await connection.query(query, [
        newsData.titulo,
        newsData.contenido,
        newsData.fecha,
        newsData.imagen,
        newsData.imagenes,
        id
      ]);
      
      return true;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.query('DELETE FROM noticias WHERE id = ?', [id]);
      return true;
    } finally {
      connection.release();
    }
  }
  
  static async getById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM noticias WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) return null;
      
      const news = rows[0];
      if (news.imagenes && typeof news.imagenes === 'string') {
        try {
          news.imagenes = JSON.parse(news.imagenes);
        } catch (e) {
          console.error('Error parsing imagenes JSON:', e);
          news.imagenes = [];
        }
      } else {
        news.imagenes = [];
      }
      
      return news;
    } catch (error) {
      console.error('Error getting news by ID:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default News;