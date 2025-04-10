import News from '../models/News.js';
import { saveBase64Image } from '../utils/imageHelpers.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createNews = async (req, res) => {
  try {
    if (!req.body.titulo || req.body.titulo.trim().length < 3) {
      return res.status(400).json({ error: 'Título debe tener al menos 3 caracteres' });
    }
    
    if (!req.body.contenido || req.body.contenido.trim().length < 10) {
      return res.status(400).json({ error: 'Contenido debe tener al menos 10 caracteres' });
    }

    let imagePath = null;
    if (req.body.imagen && req.body.imagen.startsWith('data:image')) {
      try {
        const uploadDir = path.join(__dirname, '../../uploads/noticias');
        await fs.mkdir(uploadDir, { recursive: true });
        
        const fileName = `noticia_${Date.now()}.jpg`;
        const fullPath = path.join('uploads/noticias', fileName);
        imagePath = await saveBase64Image(req.body.imagen, fullPath);
      } catch (imgError) {
        console.error('Image processing error:', imgError);
      }
    }

    let imagenesArray = [];
    if (req.body.imagenes && Array.isArray(req.body.imagenes)) {      
      for (let i = 0; i < req.body.imagenes.length; i++) {
        const imgData = req.body.imagenes[i];
        
        if (imgData && typeof imgData === 'string' && imgData.startsWith('data:image')) {
          try {
            const uploadDir = path.join(__dirname, '../../uploads/noticias');
            await fs.mkdir(uploadDir, { recursive: true });
            
            const fileName = `noticia_add_${Date.now()}_${i}.jpg`;
            const fullPath = path.join('uploads/noticias', fileName);
            const savedPath = await saveBase64Image(imgData, fullPath);
            imagenesArray.push(savedPath);
          } catch (imgError) {
            console.error(`Error processing additional image ${i}:`, imgError);
          }
        }
      }
    }

    const newsData = {
      titulo: req.body.titulo,
      contenido: req.body.contenido,
      fecha: req.body.fecha || new Date().toISOString().split('T')[0],
      imagen: imagePath,
      imagenes: imagenesArray
    };

    const newsId = await News.create(newsData);
    const createdNews = await News.getById(newsId);
    res.status(201).json({ news: createdNews });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ 
      error: error.message,
      sqlMessage: error.sqlMessage 
    });
  }
};

export const updateNews = async (req, res) => {
  try {
    const id = req.params.id;
    
    const existingNews = await News.getById(id);
    if (!existingNews) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    
    let imagePath = existingNews.imagen;
    if (req.body.imagen && req.body.imagen.startsWith('data:image')) {
      try {
        const uploadDir = path.join(__dirname, '../../uploads/noticias');
        await fs.mkdir(uploadDir, { recursive: true });
        
        const fileName = `noticia_${Date.now()}.jpg`;
        const fullPath = path.join('uploads/noticias', fileName);
        imagePath = await saveBase64Image(req.body.imagen, fullPath);
      } catch (imgError) {
        console.error('Image processing error:', imgError);
      }
    } else if (req.body.imagen) {
      imagePath = req.body.imagen;
    }
    
    let additionalImages = existingNews.imagenes || [];
    if (req.body.imagenes && Array.isArray(req.body.imagenes)) {
      
      if (typeof additionalImages === 'string') {
        try {
          additionalImages = JSON.parse(additionalImages);
        } catch (e) {
          additionalImages = [];
        }
      }
      
      const newImages = [];
      for (let i = 0; i < req.body.imagenes.length; i++) {
        const img = req.body.imagenes[i];
        if (img.startsWith('data:image')) {
          try {
            const uploadDir = path.join(__dirname, '../../uploads/noticias');
            await fs.mkdir(uploadDir, { recursive: true });
            
            const fileName = `noticia_${id}_add_${Date.now()}_${i}.jpg`;
            const fullPath = path.join('uploads/noticias', fileName);
            const savedPath = await saveBase64Image(img, fullPath);
            newImages.push(savedPath);
          } catch (imgError) {
            console.error(`Error saving additional image ${i}:`, imgError);
          }
        } else {
          newImages.push(img);
        }
      }
      additionalImages = newImages;
    }
    
    const updateData = {
      titulo: req.body.titulo,
      contenido: req.body.contenido,
      fecha: req.body.fecha,
      imagen: imagePath,
      imagenes: additionalImages
    };
    
    await News.update(id, updateData);
    
    const updatedNews = await News.getById(id);
    res.json({ 
      success: true, 
      message: 'Noticia actualizada exitosamente', 
      news: updatedNews 
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllNews = async (req, res) => {
  try {
    const news = await News.getAll();
    res.json({ news });
  } catch (error) {
    console.error('Error getting all news:', error);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const id = req.params.id;
    
    const news = await News.getById(id);
    
    if (!news) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    
    res.json({ news });
  } catch (error) {
    console.error('Error getting news by ID:', error);
    res.status(500).json({ error: 'Error al obtener la noticia' });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const id = req.params.id;
    await News.delete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
};
