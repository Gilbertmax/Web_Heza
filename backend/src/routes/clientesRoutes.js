import express from 'express';
import { registrarCliente, obtenerClientes } from '../controllers/clientesController.js';

const router = express.Router();

router.post('/register', registrarCliente);
router.get('/', obtenerClientes);

export default router;
