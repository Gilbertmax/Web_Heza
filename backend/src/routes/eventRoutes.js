import express from 'express';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, isAdmin, createEvent);
router.put('/:id', verifyToken, isAdmin, updateEvent);
router.delete('/:id', verifyToken, isAdmin, deleteEvent);

export default router;