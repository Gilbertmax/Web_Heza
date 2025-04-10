import pool from '../config/db.js';

class Event {
  static async create(eventData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Extraer galeria del objeto eventData para evitar error de SQL
      const { galeria, ...eventFields } = eventData;
      
      const [result] = await connection.query(
        'INSERT INTO eventos SET ?', 
        eventFields
      );
      
      const eventId = result.insertId;
      
      if (galeria && Array.isArray(galeria) && galeria.length > 0) {
        const galleryValues = galeria.map(url => [eventId, url]);
        await connection.query(
          'INSERT INTO galeria_eventos (id_evento, url_imagen) VALUES ?',
          [galleryValues]
        );
      }
      
      await connection.commit();
      return eventId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [eventRows] = await connection.query(
        'SELECT * FROM eventos WHERE id = ?', 
        [id]
      );
      
      if (!eventRows[0]) return null;
      
      const event = eventRows[0];
      
      const [galleryRows] = await connection.query(
        'SELECT url_imagen FROM galeria_eventos WHERE id_evento = ?',
        [id]
      );
      
      event.galeria = galleryRows.map(row => row.url_imagen);
      
      return event;
    } finally {
      connection.release();
    }
  }
  
  static async update(id, eventData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const { galeria, ...eventFields } = eventData;
      
      if (Object.keys(eventFields).length > 0) {
        await connection.query(
          'UPDATE eventos SET ? WHERE id = ?',
          [eventFields, id]
        );
      }
      
      if (galeria && Array.isArray(galeria)) {
        await connection.query(
          'DELETE FROM galeria_eventos WHERE id_evento = ?',
          [id]
        );
        
        if (galeria.length > 0) {
          const galleryValues = galeria.map(url => [id, url]);
          await connection.query(
            'INSERT INTO galeria_eventos (id_evento, url_imagen) VALUES ?',
            [galleryValues]
          );
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
  
  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.query('DELETE FROM eventos WHERE id = ?', [id]);
      return true;
    } finally {
      connection.release();
    }
  }
  
  // In the SQL query:
  static async getAll(filters = {}) {
    const connection = await pool.getConnection();
    try {
      let query = `
        SELECT 
          e.*,
          TIME_FORMAT(e.hora, '%H:%i') as hora,
          GROUP_CONCAT(ge.url_imagen) AS galeria
        FROM eventos e
        LEFT JOIN galeria_eventos ge ON e.id = ge.id_evento
      `;
      
      const queryParams = [];
      
      if (Object.keys(filters).length > 0) {
        const filterConditions = [];
        
        if (filters.tipo) {
          filterConditions.push('tipo = ?');
          queryParams.push(filters.tipo);
        }
        
        if (filters.search) {
          filterConditions.push('(titulo LIKE ? OR descripcion LIKE ? OR ubicacion LIKE ?)');
          queryParams.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
        }
        
        if (filters.fecha_desde) {
          filterConditions.push('fecha >= ?');
          queryParams.push(filters.fecha_desde);
        }
        
        if (filters.fecha_hasta) {
          filterConditions.push('fecha <= ?');
          queryParams.push(filters.fecha_hasta);
        }
        
        // Solo agregar WHERE si hay condiciones de filtro
        if (filterConditions.length > 0) {
          query += ' WHERE ' + filterConditions.join(' AND ');
        }
      }
      
      query += ' GROUP BY e.id ORDER BY e.fecha DESC';
      
      const [rows] = await connection.query(query, queryParams);
      
      return rows.map(row => ({
        ...row,
        galeria: row.galeria ? row.galeria.split(',') : [],
        hora: row.hora || null
      }));
      
    } finally {
      connection.release();
    }
  }
}

export default Event;