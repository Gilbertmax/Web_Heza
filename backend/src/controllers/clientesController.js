import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import pool from '../config/db.js';
import User from '../models/User.js';

const registrarCliente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, email, password, telefono, empresa, rfc } = req.body;

  try {
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    
    // Validar formato de RFC
    const rfcRegex = /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;
    if (!rfcRegex.test(rfc.toUpperCase())) {
      return res.status(400).json({ error: 'Formato de RFC inválido' });
    }

    const connection = await pool.getConnection();
    try {
      // Verificar si el email ya existe en users
      const [existingUsers] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Verificar si el RFC ya existe en clientes
      const [existingRfc] = await connection.query(
        'SELECT * FROM clientes WHERE rfc = ?',
        [rfc]
      );

      if (existingRfc.length > 0) {
        return res.status(400).json({ error: 'El RFC ya está registrado' });
      }

      // Usar el método User.create que maneja la inserción en ambas tablas
      const userData = {
        nombre,
        email,
        password,
        telefono,
        rol: 'cliente',
        activo: 1,
        fecha_registro: new Date(),
        username: email // Asumiendo que username es requerido según el esquema
      };

      // Crear objeto separado con datos específicos de cliente
      const clienteData = {
        empresa,
        rfc
      };

      // Pasar userData y clienteData por separado
      await User.create(userData, clienteData);
      
      res.status(201).json({ mensaje: 'Cliente registrado exitosamente' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export { registrarCliente };