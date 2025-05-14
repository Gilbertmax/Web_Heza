import pool from '../config/db.js';
import User from '../models/User.js';
import emailService from '../utils/emailService.js';
import bcrypt from 'bcrypt';

export const getSolicitudes = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT * FROM solicitudes_acceso ORDER BY fecha_solicitud DESC'
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener solicitudes de acceso:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes de acceso' });
  } finally {
    connection.release();
  }
};

export const getSolicitudesPendientesCount = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT COUNT(*) as count FROM solicitudes_acceso WHERE estado = "pendiente"'
    );
    
    res.json({ count: rows[0].count });
  } catch (error) {
    console.error('Error al obtener conteo de solicitudes pendientes:', error);
    res.status(500).json({ error: 'Error al obtener conteo de solicitudes pendientes' });
  } finally {
    connection.release();
  }
};

export const aprobarSolicitud = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [solicitudes] = await connection.query(
      'SELECT * FROM solicitudes_acceso WHERE id = ?',
      [id]
    );
    
    if (solicitudes.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    const solicitud = solicitudes[0];
    
    await connection.query(
      'UPDATE solicitudes_acceso SET estado = "aprobada" WHERE id = ?',
      [id]
    );
    
    let username = solicitud.email.split('@')[0];
    if (!username || username.trim() === '') {
      username = 'user_' + Date.now();
    }
    
    const userData = {
      username: username,
      nombre: solicitud.nombre,
      email: solicitud.email,
      telefono: solicitud.telefono,
      rol: solicitud.tipo === 'client' ? 'cliente' : 'empleado',
      activo: 1
    };
    
    if (solicitud.tipo === 'client') {
      if (solicitud.password) {
        userData.password = solicitud.password;
      } else {
        const tempPassword = Math.random().toString(36).slice(-8);
        userData.password = tempPassword;
      }
      
      const clienteData = {
        empresa: solicitud.empresa,
        rfc: solicitud.rfc,
        sede_id: solicitud.sede_id
      };
      
      await User.create(userData, clienteData);
    } else {
      const tempPassword = Math.random().toString(36).slice(-8);
      userData.password = tempPassword;
      
      await User.create(userData);
      
      await emailService.sendEmail({
        to: solicitud.email,
        subject: 'Acceso aprobado - HEZA',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #263D4F;">HEZA Consultoría</h2>
            </div>
            <h2 style="color: #263D4F; text-align: center;">Acceso Aprobado</h2>
            <p>Hola ${solicitud.nombre},</p>
            <p>Tu solicitud de acceso a la plataforma HEZA ha sido aprobada. Puedes acceder con las siguientes credenciales:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Email:</strong> ${solicitud.email}</p>
              <p><strong>Contraseña temporal:</strong> ${tempPassword}</p>
            </div>
            <p>Te recomendamos cambiar tu contraseña después del primer inicio de sesión.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/acceso" style="background-color: #B49C73; color: #263D4F; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Iniciar Sesión</a>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
              <p>&copy; ${new Date().getFullYear()} HEZA Consultoría. Todos los derechos reservados.</p>
            </div>
          </div>
        `
      });
    }
    
    await connection.commit();
    res.json({ success: true, message: 'Solicitud aprobada correctamente' });
  } catch (error) {
    await connection.rollback();
    console.error('Error al aprobar solicitud:', error);
    res.status(500).json({ error: 'Error al aprobar solicitud' });
  } finally {
    connection.release();
  }
};

export const rechazarSolicitud = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  
  try {
    const [solicitudes] = await connection.query(
      'SELECT * FROM solicitudes_acceso WHERE id = ?',
      [id]
    );
    
    if (solicitudes.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    const solicitud = solicitudes[0];
    
    await connection.query(
      'UPDATE solicitudes_acceso SET estado = "rechazada" WHERE id = ?',
      [id]
    );
    
    await emailService.sendEmail({
      to: solicitud.email,
      subject: 'Solicitud de acceso rechazada - HEZA',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #263D4F;">HEZA Consultoría</h2>
          </div>
          <h2 style="color: #263D4F; text-align: center;">Solicitud Rechazada</h2>
          <p>Hola ${solicitud.nombre},</p>
          <p>Lamentamos informarte que tu solicitud de acceso a la plataforma HEZA ha sido rechazada.</p>
          <p>Si crees que esto es un error o necesitas más información, por favor contacta con nuestro equipo de soporte.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} HEZA Consultoría. Todos los derechos reservados.</p>
          </div>
        </div>
      `
    });
    
    res.json({ success: true, message: 'Solicitud rechazada correctamente' });
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    res.status(500).json({ error: 'Error al rechazar solicitud' });
  } finally {
    connection.release();
  }
};