import User from '../models/User.js';
import pool from '../config/db.js';

// Get all clients
export const getAllClients = async (req, res) => {
  try {
    // Only admins can access all clients
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para acceder a esta información' });
    }
    
    const filters = {
      rol: 'cliente',
      search: req.query.search,
      activo: req.query.activo !== undefined ? parseInt(req.query.activo) : undefined
    };
    
    const clients = await User.getAll(filters);
    
    // Get additional client data
    const connection = await pool.getConnection();
    try {
      for (const client of clients) {
        // Remove password
        delete client.password;
        
        // Get client details
        const [clientRows] = await connection.query(
          'SELECT * FROM clientes WHERE id = ?',
          [client.id]
        );
        
        if (clientRows[0]) {
          Object.assign(client, clientRows[0]);
        }
      }
    } finally {
      connection.release();
    }
    
    res.json({ clients });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener lista de clientes' });
  }
};

// Get client by ID
export const getClientById = async (req, res) => {
  try {
    const clientId = req.params.id;
    
    // Check if user is authorized (admin or the client itself)
    if (req.user.rol !== 'admin' && req.user.id !== parseInt(clientId)) {
      return res.status(403).json({ error: 'No autorizado para acceder a esta información' });
    }
    
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    if (client.rol !== 'cliente') {
      return res.status(404).json({ error: 'Usuario no es un cliente' });
    }
    
    // Remove password
    delete client.password;
    
    res.json({ client });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error al obtener información del cliente' });
  }
};

// Create new client
export const createClient = async (req, res) => {
  try {
    // Only admins can create clients
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para crear clientes' });
    }
    
    const clientData = {
      ...req.body,
      rol: 'cliente'
    };
    
    // Check if email already exists
    const existingUser = await User.findByEmail(clientData.email);
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }
    
    // Create client
    const clientId = await User.create(clientData);
    
    // Get created client
    const client = await User.findById(clientId);
    
    // Remove password
    delete client.password;
    
    res.status(201).json({ client });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

// Update client
export const updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    
    // Check if user is authorized (admin or the client itself)
    if (req.user.rol !== 'admin' && req.user.id !== parseInt(clientId)) {
      return res.status(403).json({ error: 'No autorizado para modificar este cliente' });
    }
    
    // Get current client
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    if (client.rol !== 'cliente') {
      return res.status(404).json({ error: 'Usuario no es un cliente' });
    }
    
    const clientData = req.body;
    
    // If not admin, don't allow certain fields to be changed
    if (req.user.rol !== 'admin') {
      delete clientData.rol;
      delete clientData.activo;
    }
    
    await User.update(clientId, clientData);
    
    // Get updated client
    const updatedClient = await User.findById(clientId);
    
    // Remove password
    delete updatedClient.password;
    
    res.json({ client: updatedClient });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

// Delete client
export const deleteClient = async (req, res) => {
  try {
    // Only admins can delete clients
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para eliminar clientes' });
    }
    
    const clientId = req.params.id;
    
    // Get client
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    if (client.rol !== 'cliente') {
      return res.status(404).json({ error: 'Usuario no es un cliente' });
    }
    
    await User.delete(clientId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};

// Get client services
export const getClientServices = async (req, res) => {
  try {
    const clientId = req.params.id || req.user.id;
    
    // Check if user is authorized (admin or the client itself)
    if (req.user.rol !== 'admin' && req.user.id !== parseInt(clientId)) {
      return res.status(403).json({ error: 'No autorizado para acceder a esta información' });
    }
    
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT cs.*, s.nombre, s.descripcion
         FROM cliente_servicio cs
         JOIN servicios s ON cs.id_servicio = s.id
         WHERE cs.id_cliente = ?`,
        [clientId]
      );
      
      res.json({ services: rows });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al obtener servicios del cliente:', error);
    res.status(500).json({ error: 'Error al obtener servicios del cliente' });
  }
};