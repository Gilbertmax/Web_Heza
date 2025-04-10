import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export const saveBase64Image = async (base64Data, imagePath) => {
  try {
    const absolutePath = path.join(process.cwd(), imagePath);
    const directory = path.dirname(absolutePath);
    
    await fs.mkdir(directory, { recursive: true });
    
    const base64Content = base64Data.includes(',') 
      ? base64Data.split(',')[1] 
      : base64Data;
    
    const buffer = Buffer.from(base64Content, 'base64');
    
    await sharp(buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(absolutePath);

    return '/' + imagePath.replace(/\\/g, '/');
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Error processing image');
  }
};