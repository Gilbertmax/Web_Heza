import Event from '../models/Event.js';

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const filters = {
      tipo: req.query.tipo,
      search: req.query.search,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta
    };
    
    const events = await Event.getAll(filters);
    
    res.json({ events });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    res.json({ event });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({ error: 'Error al obtener evento' });
  }
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    // Only admins can create events
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para crear eventos' });
    }
    
    const eventData = req.body;
    
    const eventId = await Event.create(eventData);
    
    const event = await Event.findById(eventId);
    
    res.status(201).json({ event });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ error: 'Error al crear evento' });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    // Only admins can update events
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para modificar eventos' });
    }
    
    const eventId = req.params.id;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    const eventData = req.body;
    
    await Event.update(eventId, eventData);
    
    const updatedEvent = await Event.findById(eventId);
    
    res.json({ event: updatedEvent });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    // Only admins can delete events
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para eliminar eventos' });
    }
    
    const eventId = req.params.id;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    await Event.delete(eventId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
};