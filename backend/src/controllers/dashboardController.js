import User from '../models/User.js';
import pool from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para acceder a esta información' });
    }
    
    const connection = await pool.getConnection();
    try {
      // Obtener total de usuarios
      const [userRows] = await connection.query(
        'SELECT COUNT(*) as total FROM users WHERE rol != "admin"'
      );
      const totalUsers = userRows[0].total;
      
      // Obtener clientes activos
      const [clientRows] = await connection.query(
        'SELECT COUNT(*) as total FROM users WHERE rol = "cliente" AND activo = 1'
      );
      const activeClients = clientRows[0].total;
      
      // Obtener solicitudes de acceso pendientes
      const [pendingAccessRows] = await connection.query(
        'SELECT COUNT(*) as total FROM users WHERE activo = 0 AND rol != "admin"'
      );
      const pendingAccessRequests = pendingAccessRows[0].total;
      
      // No hay tabla de tareas, usamos solicitudes pendientes como tareas pendientes
      const pendingTasks = pendingAccessRequests;
      
      // Obtener clientes recientes para actividad
      const [recentClients] = await connection.query(
        `SELECT u.id, u.nombre, u.activo 
         FROM users u 
         WHERE u.rol = "cliente" 
         ORDER BY u.fecha_registro DESC 
         LIMIT 5`
      );
      
      res.json({
        stats: {
          totalUsers,
          activeClients,
          pendingTasks,
          pendingAccessRequests
        },
        recentClients
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
  }
};

export const getClientDashboardStats = async (req, res) => {
  try {
    const clientId = req.user.id;
    
    if (req.user.rol !== 'cliente') {
      return res.status(403).json({ error: 'No autorizado para acceder a esta información' });
    }
    
    const connection = await pool.getConnection();
    try {
      // Obtener documentos del cliente
      const [docRows] = await connection.query(
        'SELECT COUNT(*) as total FROM documentos WHERE cliente_id = ?',
        [clientId]
      );
      const totalDocuments = docRows[0].total;
      
      // Obtener servicios activos del cliente
      const [serviceRows] = await connection.query(
        'SELECT COUNT(*) as total FROM servicios WHERE cliente_id = ? AND estado = "activo"',
        [clientId]
      );
      const activeServices = serviceRows[0].total;
      
      // Obtener próximos eventos
      const [eventRows] = await connection.query(
        `SELECT id, titulo, fecha, descripcion 
         FROM eventos 
         WHERE fecha >= CURDATE() 
         ORDER BY fecha ASC 
         LIMIT 3`
      );
      
      res.json({
        stats: {
          totalDocuments,
          activeServices,
          upcomingEvents: eventRows.length
        },
        upcomingEvents: eventRows
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al obtener estadísticas del cliente:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del cliente' });
  }
};

// Obtener el número de solicitudes de acceso pendientes para el dashboard
export const getPendingRequests = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para acceder a esta información' });
    }
    
    const connection = await pool.getConnection();
    try {
      // Verificar si la tabla solicitudes_acceso existe
      const [tableExists] = await connection.query(
        "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'heza' AND table_name = 'solicitudes_acceso'"
      );
      
      // Si la tabla no existe, devolver 0 como conteo
      if (tableExists[0].count === 0) {
        return res.json({ count: 0 });
      }
      
      // Obtener solicitudes de acceso pendientes
      const [rows] = await connection.query(
        'SELECT COUNT(*) as count FROM solicitudes_acceso WHERE estado = "pendiente"'
      );
      
      res.json({ count: rows[0].count });
    } catch (error) {
      console.error('Error al obtener conteo de solicitudes pendientes:', error);
      // En caso de error, devolver 0 como valor seguro
      res.json({ count: 0 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al obtener solicitudes pendientes:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes pendientes' });
  }
};