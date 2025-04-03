import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is active
    const user = await User.findById(decoded.id);
    if (!user || user.activo === 0) {
      return res.status(401).json({ error: 'Usuario no válido o desactivado' });
    }
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    console.error('Error en autenticación:', error);
    res.status(500).json({ error: 'Error en autenticación' });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
  }
  
  next();
};

// Check if user is client
export const isClient = (req, res, next) => {
  if (req.user.rol !== 'cliente') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de cliente' });
  }
  
  next();
};

// Check if user is employee
export const isEmployee = (req, res, next) => {
  if (req.user.rol !== 'empleado') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de empleado' });
  }
  
  next();
};

// Check if user is admin or client
export const isAdminOrClient = (req, res, next) => {
  if (req.user.rol !== 'admin' && req.user.rol !== 'cliente') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  next();
};

// Check if user is admin or employee
export const isAdminOrEmployee = (req, res, next) => {
  if (req.user.rol !== 'admin' && req.user.rol !== 'empleado') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  next();
};