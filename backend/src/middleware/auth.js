import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user || user.activo === 0) {
      return res.status(401).json({ error: 'Usuario no válido o desactivado' });
    }
    
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

export const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
  }
  
  next();
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
  }
  
  next();
};

export const isClient = (req, res, next) => {
  if (req.user.rol !== 'cliente') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de cliente' });
  }
  
  next();
};

export const isEmployee = (req, res, next) => {
  if (req.user.rol !== 'empleado') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de empleado' });
  }
  
  next();
};

export const isAdminOrClient = (req, res, next) => {
  if (req.user.rol !== 'admin' && req.user.rol !== 'cliente') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  next();
};

export const isAdminOrEmployee = (req, res, next) => {
  if (req.user.rol !== 'admin' && req.user.rol !== 'empleado') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  
  next();
};