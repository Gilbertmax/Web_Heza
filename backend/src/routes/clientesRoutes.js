import express from 'express';
import { registrarCliente } from '../controllers/clientesController.js';

const router = express.Router();

router.post('/register', registrarCliente);

export default router;