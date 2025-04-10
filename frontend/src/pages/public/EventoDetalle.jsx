import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Carousel, Container, Row, Col, Badge, Modal } from 'react-bootstrap';
import Loading from '../../components/Loading/Loading';
import '../../assets/css/gallery.css';

const EventoDetalle = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/events/${id}`);
        if (response.data && response.data.event) {
          setEvento(response.data.event);
          setError(null);
        } else {
          console.error('Invalid response format:', response.data);
          setError('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error al cargar evento:', error);
        setError('Error al cargar evento');
      } finally {
        setLoading(false);
      }
    };
    fetchEvento();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x400?text=No+Image';
    
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    
    return `${process.env.REACT_APP_API_URL || ''}${imagePath}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hourInt = parseInt(hours, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';
    const displayHour = hourInt % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
        <div className="mt-3">
          <Link to="/eventos" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-2"></i>
            Volver a eventos
          </Link>
        </div>
      </Container>
    );
  }

  if (!evento) {
    return (
      <Container className="py-5">
        <div className="alert alert-warning">Evento no encontrado</div>
        <div className="mt-3">
          <Link to="/eventos" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-2"></i>
            Volver a eventos
          </Link>
        </div>
      </Container>
    );
  }

  const hasGallery = evento.galeria && Array.isArray(evento.galeria) && evento.galeria.length > 0;
  
  // Función para abrir el lightbox con una imagen específica
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  // Calcular todas las imágenes (principal + galería) para el lightbox
  const allImages = [];
  if (evento.imagen) allImages.push(evento.imagen);
  if (hasGallery) allImages.push(...evento.galeria);

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Link to="/eventos" className="btn btn-outline-primary mb-3">
          <i className="bi bi-arrow-left me-2"></i>
          Volver a eventos
        </Link>
        <h1 className="text-primary">{evento.titulo}</h1>
        <div className="d-flex align-items-center mb-3">
          <Badge bg={evento.tipo === 'Próximo' ? 'success' : 'secondary'} className="me-2">
            {evento.tipo}
          </Badge>
          <span className="text-muted me-3">
            <i className="bi bi-calendar-event me-2"></i>
            {formatDate(evento.fecha)}
          </span>
          {evento.hora && (
            <span className="text-muted">
              <i className="bi bi-clock me-2"></i>
              {formatTime(evento.hora)}
            </span>
          )}
        </div>
        {evento.ubicacion && (
          <p className="mb-4">
            <i className="bi bi-geo-alt me-2"></i>
            {evento.ubicacion}
          </p>
        )}
      </div>

      <div className="card mb-5 shadow-sm border-0 overflow-hidden">
        {hasGallery ? (
          <div className="position-relative">
            <Carousel 
              ref={carouselRef} 
              interval={5000} 
              className="h-100 evento-carousel"
              activeIndex={activeIndex}
              onSelect={(index) => setActiveIndex(index)}
              indicators={true}
            >
              {evento.imagen && (
                <Carousel.Item>
                  <div className="carousel-image-container" onClick={() => openLightbox(0)}>
                    <img 
                      src={getImageUrl(evento.imagen)} 
                      className="d-block w-100 zoom-effect" 
                      alt={evento.titulo} 
                      style={{ height: '500px', objectFit: 'cover' }}
                    />
                    <div className="carousel-image-overlay">
                      <span className="expand-icon"><i className="bi bi-arrows-fullscreen"></i></span>
                    </div>
                  </div>
                </Carousel.Item>
              )}
              
              {evento.galeria.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <div className="carousel-image-container" onClick={() => openLightbox(idx + (evento.imagen ? 1 : 0))}>
                    <img 
                      src={getImageUrl(img)} 
                      className="d-block w-100 zoom-effect" 
                      alt={`${evento.titulo} - Imagen ${idx + 1}`} 
                      style={{ height: '500px', objectFit: 'cover' }}
                    />
                    <div className="carousel-image-overlay">
                      <span className="expand-icon"><i className="bi bi-arrows-fullscreen"></i></span>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
            
            <div className="carousel-counter">
              {activeIndex + 1} / {allImages.length}
            </div>
          </div>
        ) : (
          <div className="carousel-image-container" onClick={() => openLightbox(0)}>
            <img 
              src={getImageUrl(evento.imagen)} 
              className="card-img-top" 
              alt={evento.titulo} 
              style={{ height: '500px', objectFit: 'cover' }}
            />
            <div className="carousel-image-overlay">
              <span className="expand-icon"><i className="bi bi-arrows-fullscreen"></i></span>
            </div>
          </div>
        )}
        
        <div className="card-body p-4">
          {(evento.contenido || evento.descripcion) && (
            <div className="mb-4">
              <h4 className="mb-3">Descripción</h4>
              <p>{evento.contenido || evento.descripcion}</p>
            </div>
          )}
          
          {hasGallery && (
            <div className="mt-4">
              <h4 className="mb-3">Galería de imágenes</h4>
              <Row className="g-3 gallery-thumbnails">
                {evento.imagen && (
                  <Col xs={6} sm={4} md={3} lg={2} className="gallery-thumbnail-container">
                    <div 
                      className={`gallery-thumbnail ${activeIndex === 0 ? 'active' : ''}`}
                      onClick={() => setActiveIndex(0)}
                    >
                      <img
                        src={getImageUrl(evento.imagen)}
                        className="img-fluid"
                        alt={`Imagen principal`}
                      />
                      <div className="thumbnail-overlay">
                        <span className="thumbnail-number">1</span>
                      </div>
                    </div>
                  </Col>
                )}
                
                {evento.galeria.map((img, idx) => (
                  <Col xs={6} sm={4} md={3} lg={2} key={idx} className="gallery-thumbnail-container">
                    <div 
                      className={`gallery-thumbnail ${activeIndex === idx + (evento.imagen ? 1 : 0) ? 'active' : ''}`}
                      onClick={() => setActiveIndex(idx + (evento.imagen ? 1 : 0))}
                    >
                      <img
                        src={getImageUrl(img)}
                        className="img-fluid"
                        alt={`Thumbnail ${idx + 1}`}
                      />
                      <div className="thumbnail-overlay">
                        <span className="thumbnail-number">{idx + (evento.imagen ? 2 : 1)}</span>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      </div>
      
      {/* Lightbox Modal */}
      <Modal 
        show={showLightbox} 
        onHide={() => setShowLightbox(false)} 
        size="xl" 
        centered 
        className="gallery-lightbox-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{evento.titulo} - Imagen {lightboxIndex + 1} de {allImages.length}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Carousel 
            activeIndex={lightboxIndex} 
            onSelect={setLightboxIndex}
            interval={null}
            indicators={false}
            className="lightbox-carousel"
          >
            {allImages.map((img, idx) => (
              <Carousel.Item key={idx}>
                <div className="lightbox-img-container d-flex justify-content-center align-items-center">
                  <img 
                    src={getImageUrl(img)} 
                    className="lightbox-img" 
                    alt={`${evento.titulo} - Imagen ${idx + 1}`} 
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
          
          <div className="lightbox-controls">
            <button 
              className="btn btn-outline-light me-2" 
              onClick={() => setLightboxIndex(Math.max(0, lightboxIndex - 1))}
              disabled={lightboxIndex === 0}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <span className="text-light">{lightboxIndex + 1} / {allImages.length}</span>
            <button 
              className="btn btn-outline-light ms-2" 
              onClick={() => setLightboxIndex(Math.min(allImages.length - 1, lightboxIndex + 1))}
              disabled={lightboxIndex === allImages.length - 1}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EventoDetalle;