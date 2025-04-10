import { useState, useEffect } from 'react';

const ImageUploader = ({ onImageUpload, initialImage = '' }) => {
  const [preview, setPreview] = useState(initialImage);

  useEffect(() => {
    setPreview(initialImage);
  }, [initialImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  return (
    <div className="mb-3">
      <input
        type="file"
        className="form-control mb-2"
        accept="image/*"
        onChange={handleFileChange}
        key={Date.now()}
      />
      {preview && (
        <div className="mt-2">
          <img 
            src={preview} 
            alt="Preview" 
            className="img-thumbnail" 
            style={{ maxHeight: '200px' }} 
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;