import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import axios from 'axios';
import { Carousel, Container, Row, Col, Card, Badge } from 'react-bootstrap';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hourInt = parseInt(hours, 10);
    const period = hourInt >= 12 ? 'PM' : 'AM';
    const displayHour = hourInt % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };


  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/events');
        if (response.data && response.data.events) {
          setEventos(response.data.events);
          setError(null);
        } else {
          console.error('Invalid response format:', response.data);
          setError('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setError('Error al cargar eventos');
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container py-5">
        <h1 className="text-primary mb-4">Próximos Eventos</h1>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const eventosFuturos = eventos.filter(evento => evento.tipo === 'Próximo');
  const eventosPasados = eventos.filter(evento => evento.tipo === 'Pasado');
  
  // Encontrar el primer evento próximo para destacarlo
  const eventoDestacado = eventosFuturos.length > 0 ? eventosFuturos[0] : null;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x400?text=No+Image';
    
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    
    return `${process.env.REACT_APP_API_URL || ''}${imagePath}`;
  };

  return (
    <Container fluid className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h1 className="display-4 text-primary fw-bold">Eventos</h1>
          <p className="lead text-muted">Conoce nuestros próximos eventos y revisa los anteriores</p>
          <hr className="my-4 mx-auto" style={{ width: '50px', height: '3px', backgroundColor: '#0d6efd' }} />
        </div>
        
        {/* Sección de eventos próximos */}
        <div className="mb-5">
          <div className="d-flex align-items-center mb-4">
            <h2 className="fw-bold mb-0">Próximos Eventos</h2>
            <div className="ms-3 flex-grow-1">
              <hr className="my-0" />
            </div>
          </div>
          
          {eventosFuturos.length > 0 ? (
            <Row>
              {/* Evento destacado */}
              {eventoDestacado && (
                <Col lg={12} className="mb-4">
                  <Card className="border-0 shadow overflow-hidden">
                    <div className="position-relative">
                      {eventoDestacado.galeria && eventoDestacado.galeria.length > 0 ? (
                        <Carousel ref={carouselRef} interval={5000} className="h-100 featured-event-carousel">
                          {eventoDestacado.imagen && (
                            <Carousel.Item>
                              <img 
                                src={getImageUrl(eventoDestacado.imagen)} 
                                className="d-block w-100" 
                                alt="Evento destacado" 
                                style={{ height: '500px', objectFit: 'cover' }}
                              />
                            </Carousel.Item>
                          )}
                          
                          {eventoDestacado.galeria.map((img, idx) => (
                            <Carousel.Item key={idx}>
                              <img 
                                src={getImageUrl(img)} 
                                className="d-block w-100" 
                                alt={`${eventoDestacado.titulo} - Imagen ${idx + 1}`} 
                                style={{ height: '500px', objectFit: 'cover' }}
                              />
                            </Carousel.Item>
                          ))}
                        </Carousel>
                      ) : (
                        <img 
                          src={getImageUrl(eventoDestacado.imagen)} 
                          className="card-img-top" 
                          alt="Evento destacado" 
                          style={{ height: '500px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="position-absolute top-0 start-0 p-3">
                        <Badge bg="danger" pill className="px-3 py-2 fs-6">Destacado</Badge>
                      </div>
                    </div>
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="success" className="px-3 py-2">Próximo evento</Badge>
                        <span className="text-muted">
                          <i className="bi bi-calendar-event me-2"></i>
                          {formatDate(eventoDestacado.fecha)}
                        </span>
                      </div>
                      <h2 className="fw-bold mb-3">{eventoDestacado.titulo}</h2>
                      {eventoDestacado.contenido && (
                        <p className="text-muted mb-3">
                          {eventoDestacado.contenido.length > 150 
                            ? `${eventoDestacado.contenido.substring(0, 150)}...` 
                            : eventoDestacado.contenido}
                        </p>
                      )}
                      <div className="d-flex justify-content-between align-items-center">
                        {eventoDestacado.ubicacion && (
                          <p className="mb-0 text-muted">
                            <i className="bi bi-geo-alt me-2"></i>
                            {eventoDestacado.ubicacion}
                          </p>
                        )}
                        <Link to={`/eventos/${eventoDestacado.id}`} className="btn btn-primary px-4 py-2">
                          Ver detalles
                          <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              )}
              
              {/* Otros eventos próximos */}
              {eventosFuturos.slice(1).map(evento => (
                <Col md={6} lg={4} key={evento.id} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm hover-scale">
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={getImageUrl(evento.imagen)} 
                        alt={evento.titulo}
                        style={{ height: '220px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 end-0 p-2">
                        <Badge bg="success" pill className="px-3 py-2">
                          Próximo
                        </Badge>
                      </div>
                    </div>
                    <Card.Body className="p-4">
                      <Card.Title className="fw-bold">{evento.titulo}</Card.Title>
                      <div className="d-flex align-items-center mb-3 text-muted small">
                        <i className="bi bi-calendar-event me-2"></i>
                        <span>{formatDate(evento.fecha)}</span>
                      </div>
                      {evento.contenido && (
                        <p className="text-muted small mb-3">
                          {evento.contenido.length > 100 
                            ? `${evento.contenido.substring(0, 100)}...` 
                            : evento.contenido}
                        </p>
                      )}
                      {evento.ubicacion && (
                        <p className="small text-muted mb-3">
                          <i className="bi bi-geo-alt me-2"></i>
                          {evento.ubicacion}
                        </p>
                      )}
                      <Link 
                        to={`/eventos/${evento.id}`} 
                        className="btn btn-outline-primary w-100"
                      >
                        Ver detalles
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="alert alert-info text-center py-4">
              <i className="bi bi-calendar-x fs-1 d-block mb-3"></i>
              <h4>No hay eventos próximos programados</h4>
              <p className="mb-0">Estamos preparando nuevos eventos. ¡Vuelve pronto!</p>
            </div>
          )}
        </div>

        {/* Sección de eventos pasados */}
        {eventosPasados.length > 0 && (
          <div className="mt-5 pt-3">
            <div className="d-flex align-items-center mb-4">
              <h2 className="fw-bold mb-0">Eventos Anteriores</h2>
              <div className="ms-3 flex-grow-1">
                <hr className="my-0" />
              </div>
            </div>
            
            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {eventosPasados.map(evento => (
                <Col key={evento.id}>
                  <Card className="h-100 border-0 shadow-sm hover-scale" style={{ opacity: '0.9' }}>
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={getImageUrl(evento.imagen)} 
                        alt={evento.titulo}
                        style={{ height: '200px', objectFit: 'cover', filter: 'grayscale(20%)' }}
                      />
                      <div className="position-absolute top-0 end-0 p-2">
                        <Badge bg="secondary" pill className="px-3 py-2">
                          Pasado
                        </Badge>
                      </div>
                    </div>
                    <Card.Body className="p-3">
                      <Card.Title>{evento.titulo}</Card.Title>
                      
                      {evento.hora && (
                        <div className="d-flex align-items-center mb-2 text-muted small">
                          <i className="bi bi-clock me-2"></i>
                          <span>{formatTime(evento.hora)}</span>
                        </div>
                      )}
                      
                      <div className="d-flex align-items-center mb-2 text-muted small">
                        <i className="bi bi-calendar-event me-2"></i>
                        <span>{formatDate(evento.fecha)}</span>
                      </div>
                      {evento.contenido && (
                        <p className="text-muted small mb-3">
                          {evento.contenido.length > 80 
                            ? `${evento.contenido.substring(0, 80)}...` 
                            : evento.contenido}
                        </p>
                      )}
                      {evento.ubicacion && (
                        <p className="small text-muted mb-3">
                          <i className="bi bi-geo-alt me-2"></i>
                          {evento.ubicacion}
                        </p>
                      )}
                      <Link 
                        to={`/eventos/${evento.id}`} 
                        className="btn btn-outline-secondary w-100 btn-sm"
                      >
                        Ver detalles
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
        
        {eventosFuturos.length === 0 && eventosPasados.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-calendar-x display-1 text-muted mb-3"></i>
            <h3>No hay eventos registrados</h3>
            <p>Estamos trabajando en nuevos eventos. ¡Vuelve pronto!</p>
          </div>
        )}
      </Container>
    </Container>
  );
};

export default Eventos;