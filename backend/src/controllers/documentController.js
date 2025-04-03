import Document from '../models/Document.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const getClientDocuments = async (req, res) => {
  try {
    const clientId = req.params.clientId || req.user.id;
    
    if (req.user.rol !== 'admin' && req.user.id !== parseInt(clientId)) {
      return res.status(403).json({ error: 'No autorizado para acceder a estos documentos' });
    }
    
    const filters = {
      categoria: req.query.categoria,
      search: req.query.search,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta
    };
    
    const documents = await Document.getByClient(clientId, filters);
    
    res.json({ documents });
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
};

export const getDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    if (req.user.rol !== 'admin' && req.user.id !== document.id_cliente) {
      return res.status(403).json({ error: 'No autorizado para acceder a este documento' });
    }
    
    res.json({ document });
  } catch (error) {
    console.error('Error al obtener documento:', error);
    res.status(500).json({ error: 'Error al obtener documento' });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
    }
    
    const { nombre, descripcion, id_categoria } = req.body;
    const clientId = req.body.id_cliente || req.user.id;
    
    if (req.user.rol !== 'admin' && req.user.id !== parseInt(clientId)) {
      return res.status(403).json({ error: 'No autorizado para subir documentos para este cliente' });
    }
    
    const documentData = {
      nombre: nombre || req.file.originalname,
      descripcion: descripcion || '',
      ruta_archivo: req.file.path,
      tipo_archivo: path.extname(req.file.originalname).substring(1),
      tamano_archivo: req.file.size,
      id_categoria: id_categoria || null,
      id_cliente: clientId,
      id_empleado: req.user.rol === 'empleado' ? req.user.id : null
    };
    
    const documentId = await Document.create(documentData);
    
    const document = await Document.findById(documentId);
    
    res.status(201).json({ document });
  } catch (error) {
    console.error('Error al subir documento:', error);
    res.status(500).json({ error: 'Error al subir documento' });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    if (req.user.rol !== 'admin' && req.user.id !== document.id_cliente) {
      return res.status(403).json({ error: 'No autorizado para modificar este documento' });
    }
    
    const documentData = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      id_categoria: req.body.id_categoria
    };
    
    if (req.file) {
      if (fs.existsSync(document.ruta_archivo)) {
        fs.unlinkSync(document.ruta_archivo);
      }
      
      documentData.ruta_archivo = req.file.path;
      documentData.tipo_archivo = path.extname(req.file.originalname).substring(1);
      documentData.tamano_archivo = req.file.size;
    }
    
    await Document.update(documentId, documentData);
    
    const updatedDocument = await Document.findById(documentId);
    
    res.json({ document: updatedDocument });
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    res.status(500).json({ error: 'Error al actualizar documento' });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    if (req.user.rol !== 'admin' && req.user.id !== document.id_cliente) {
      return res.status(403).json({ error: 'No autorizado para eliminar este documento' });
    }
    
    if (fs.existsSync(document.ruta_archivo)) {
      fs.unlinkSync(document.ruta_archivo);
    }
    
    await Document.delete(documentId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ error: 'Error al eliminar documento' });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    if (req.user.rol !== 'admin' && req.user.id !== document.id_cliente) {
      return res.status(403).json({ error: 'No autorizado para descargar este documento' });
    }
    
    if (!fs.existsSync(document.ruta_archivo)) {
      return res.status(404).json({ error: 'Archivo no encontrado en el servidor' });
    }
    
    res.download(document.ruta_archivo, document.nombre);
  } catch (error) {
    console.error('Error al descargar documento:', error);
    res.status(500).json({ error: 'Error al descargar documento' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Document.getCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías de documentos' });
  }
};