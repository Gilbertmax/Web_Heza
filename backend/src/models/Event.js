import pool from '../config/db.js';

class Event {
  static async create(eventData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.query(
        'INSERT INTO eventos SET ?', 
        eventData
      );
      
      const eventId = result.insertId;
      
      if (eventData.galeria && Array.isArray(eventData.galeria) && eventData.galeria.length > 0) {
        const galleryValues = eventData.galeria.map(url => [eventId, url]);
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
  
  static async getAll(filters = {}) {
    const connection = await pool.getConnection();
    try {
      let query = 'SELECT * FROM eventos';
      const queryParams = [];
      
      if (Object.keys(filters).length > 0) {
        query += ' WHERE ';
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
        
        query += filterConditions.join(' AND ');
      }
      
      query += ' ORDER BY fecha DESC';
      
      const [rows] = await connection.query(query, queryParams);
      
      const events = await Promise.all(rows.map(async (event) => {
        const [galleryRows] = await connection.query(
          'SELECT url_imagen FROM galeria_eventos WHERE id_evento = ?',
          [event.id]
        );
        
        return {
          ...event,
          galeria: galleryRows.map(row => row.url_imagen)
        };
      }));
      
      return events;
    } finally {
      connection.release();
    }
  }
}

export default Event;