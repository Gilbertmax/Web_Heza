import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register a new user
export const register = async (req, res) => {
  try {
    const userData = req.body;
    
    // Check if email already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }
    
    // Create user
    const userId = await User.create(userData);
    
    // Get created user without password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }
    
    // Remove password from response
    delete user.password;
    
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Check if user is active
    if (user.activo === 0) {
      return res.status(401).json({ error: 'Usuario desactivado' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Update last login
    await User.update(user.id, { ultima_conexion: new Date() });
    
    // Remove password from response
    delete user.password;
    
    res.json({ user, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user || user.rol !== 'admin') {
      return res.status(401).json({ error: 'Credenciales administrativas inválidas' });
    }
    
    // Check if user is active
    if (user.activo === 0) {
      return res.status(401).json({ error: 'Usuario desactivado' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales administrativas inválidas' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Update last login
    await User.update(user.id, { ultima_conexion: new Date() });
    
    // Remove password from response
    delete user.password;
    
    res.json({ admin: user, token });
  } catch (error) {
    console.error('Error en admin login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión como administrador' });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Remove password from response
    delete user.password;
    
    res.json({ user });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil de usuario' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = req.body;
    
    // Don't allow role changes through this endpoint
    delete userData.rol;
    
    await User.update(userId, userData);
    
    const updatedUser = await User.findById(userId);
    
    // Remove password from response
    delete updatedUser.password;
    
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil de usuario' });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }
    
    // Update password
    await User.update(userId, { password: newPassword });
    
    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};