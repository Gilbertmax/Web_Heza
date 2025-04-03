import Document from '../models/Document.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload directory
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Get all documents for a client
export const getClientDocuments = async (req, res) => {
  try {
    const clientId = req.params.clientId || req.user.id;
    
    // Check if user is authorized (admin or the client itself)
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

// Get document by ID
export const getDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    // Check if user is authorized (admin or the client that owns the document)
    if (req.user.rol !== 'admin' && req.user.id !== document.id_cliente) {
      return res.status(403).json({ error: 'No autorizado para acceder a este documento' });
    }
    
    res.json({ document });
  } catch (error) {
    console.error('Error al obtener documento:', error);
    res.status(500).json({ error: 'Error al obtener documento' });
  }
};

// Upload a new document
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
    }
    
    const { nombre, descripcion, id_categoria } = req.body;
    const clientId = req.body.id_cliente || req.user.id;
    
    // Check if user is authorized (admin or the client itself)
    if (req.user.rol !== 'admin' && req.user.id !== parseInt(clientId)) {
      return res.status(403).json({ error: 'No autorizado para subir documentos para este cliente' });
    }
    
    // Create document record
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

// Update document
export const updateDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    // Get current document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    // Check if user is authorized (admin or the client that owns the document)
    if (req.user.rol !== 'admin' && req.user.id !== document.id_cliente) {
      return res.status(403).json({ error: 'No autorizado para modificar este documento' });
    }
    
    // Update document data
    const documentData = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      id_categoria: req.body.id_categoria
    };
    
    // If a new file is uploaded
    if (req.file) {
      // Delete old file
      if (fs.existsSync(document.ruta_archivo)) {
        fs.unlinkSync(document.ruta_archivo);
      }
      
      // Update with new file data
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

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    // Get current document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    // Check if user is authorized (admin or the client that owns the document)
    if (req.user.rol !== 'admin' && req.user.id !== document.id_cliente) {
      return res.status(403).json({ error: 'No autorizado para eliminar este documento' });
    }
    
    // Delete file
    if (fs.existsSync(document.ruta_archivo)) {
      fs.unlinkSync(document.ruta_archivo);
    }
    
    // Delete document record
    await Document.delete(documentId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ error: 'Error al eliminar documento' });
  }
};

// Download document
export const downloadDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }
    
    // Check if user is authorized (admin or the client that owns the document)
    if (req.user.rol !== 'admin' && req.user.id !== document.id_cliente) {
      return res.status(403).json({ error: 'No autorizado para descargar este documento' });
    }
    
    // Check if file exists
    if (!fs.existsSync(document.ruta_archivo)) {
      return res.status(404).json({ error: 'Archivo no encontrado en el servidor' });
    }
    
    res.download(document.ruta_archivo, document.nombre);
  } catch (error) {
    console.error('Error al descargar documento:', error);
    res.status(500).json({ error: 'Error al descargar documento' });
  }
};

// Get document categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Document.getCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías de documentos' });
  }
};