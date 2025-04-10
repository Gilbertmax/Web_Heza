import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Carousel, Container, Row, Badge } from 'react-bootstrap';
import Loading from '../../components/Loading/Loading';

const EventoDetalle = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

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
          <Carousel ref={carouselRef} interval={5000} className="h-100">
            {evento.imagen && (
              <Carousel.Item>
                <img 
                  src={getImageUrl(evento.imagen)} 
                  className="d-block w-100" 
                  alt={evento.titulo} 
                  style={{ height: '500px', objectFit: 'cover' }}
                />
              </Carousel.Item>
            )}
            
            {evento.galeria.map((img, idx) => (
              <Carousel.Item key={idx}>
                <img 
                  src={getImageUrl(img)} 
                  className="d-block w-100" 
                  alt={`${evento.titulo} - Imagen ${idx + 1}`} 
                  style={{ height: '500px', objectFit: 'cover' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <img 
            src={getImageUrl(evento.imagen)} 
            className="card-img-top" 
            alt={evento.titulo} 
            style={{ height: '500px', objectFit: 'cover' }}
          />
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
              <Row xs={2} md={4} className="g-3">
                {evento.galeria.map((img, idx) => (
                  <div key={idx} className="col-2">
                    <img
                      src={getImageUrl(img)}
                      className="img-thumbnail cursor-pointer"
                      alt={`Thumbnail ${idx + 1}`}
                      onClick={() => carouselRef.current.to(idx + (evento.imagen ? 0 : 1))} // Fix: Use .to() instead of .select()
                      style={{ height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </Row>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default EventoDetalle;