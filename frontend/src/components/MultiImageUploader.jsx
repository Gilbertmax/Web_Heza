import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';

const MultiImageUploader = ({ onImagesUpload, initialImages = [] }) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setPreviews(initialImages);
      setImages(initialImages);
    } else {
      setPreviews([]);
      setImages([]);
    }
  }, [initialImages]);

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.7);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newPreviews = [...previews];
    const newImages = [...images];
    
    for (const file of files) {
      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          newImages.push(reader.result);
          
          setPreviews([...newPreviews]);
          setImages([...newImages]);
          onImagesUpload([...newImages]);
        };
        
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  const removeImage = (index) => {
    const newPreviews = [...previews];
    const newImages = [...images];
    
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    
    setPreviews(newPreviews);
    setImages(newImages);
    onImagesUpload(newImages);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    
    return `${process.env.REACT_APP_API_URL || ''}${imagePath}`;
  };

  return (
    <div className="mb-3">
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          key={Date.now()}
        />
        <small className="text-muted">Puedes seleccionar múltiples imágenes</small>
      </div>
      
      {previews.length > 0 && (
        <div className="mt-3">
          <h6>Imágenes seleccionadas ({previews.length})</h6>
          <Row className="g-2">
            {previews.map((preview, index) => (
              <Col key={index} xs={6} md={4} lg={3}>
                <div className="position-relative">
                  <img 
                    src={typeof preview === 'string' && preview.startsWith('/') 
                      ? getImageUrl(preview) 
                      : preview} 
                    alt={`Preview ${index + 1}`} 
                    className="img-thumbnail" 
                    style={{ width: '100%', height: '120px', objectFit: 'cover' }} 
                  />
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="position-absolute top-0 end-0"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader;