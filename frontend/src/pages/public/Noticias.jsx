import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Carousel, Row, Col, Card, Badge, Container } from 'react-bootstrap';
import Loading from '../../components/Loading/Loading';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await axios.get('/api/news');
        
        if (response.data && response.data.news) {
          setNoticias(response.data.news);
        } else {
          console.error('Invalid response format:', response.data);
          setError('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Error al cargar noticias');
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x400?text=HEZA+Noticias';
    
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    
    return `${process.env.REACT_APP_API_URL || ''}${imagePath}`;
  };

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
        <h1 className="text-primary mb-4">Últimas Noticias</h1>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (noticias.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="text-primary mb-4">Últimas Noticias</h1>
        <div className="alert alert-info">No hay noticias disponibles actualmente.</div>
      </div>
    );
  }

  const destacada = noticias[0];
  const restNoticias = noticias.slice(1);

  const hasAdditionalImages = destacada.imagenes && Array.isArray(destacada.imagenes) && destacada.imagenes.length > 0;

  return (
    <Container className="py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="text-primary border-bottom pb-2">Últimas Noticias</h1>
        </div>
      </div>
      
      <div className="card mb-5 shadow-lg border-0 overflow-hidden">
        <div className="row g-0">
          <div className="col-lg-7">
            {hasAdditionalImages ? (
              <Carousel ref={carouselRef} interval={5000} className="h-100">
                {destacada.imagen && (
                  <Carousel.Item>
                    <div className="carousel-image-container">
                      <img
                        src={getImageUrl(destacada.imagen)}
                        alt={destacada.titulo}
                        className="d-block w-100"
                        style={{ height: '500px', objectFit: 'cover' }}
                      />
                    </div>
                  </Carousel.Item>
                )}
                
                {destacada.imagenes.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <div className="carousel-image-container">
                      <img
                        src={getImageUrl(img)}
                        alt={`${destacada.titulo} - Imagen ${idx + 1}`}
                        className="d-block w-100"
                        style={{ height: '500px', objectFit: 'cover' }}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div className="featured-image-container">
                <img
                  src={getImageUrl(destacada.imagen)}
                  alt={destacada.titulo}
                  className="img-fluid h-100 w-100"
                  style={{ objectFit: 'cover', maxHeight: '500px' }}
                />
              </div>
            )}
          </div>
          <div className="col-lg-5">
            <div className="card-body d-flex flex-column h-100 p-4">
              <div>
                <Badge bg="primary" className="mb-2">Destacada</Badge>
                <h2 className="card-title">{destacada.titulo}</h2>
                <p className="text-muted">
                  <i className="bi bi-calendar-event me-2"></i>
                  {formatDate(destacada.fecha)}
                </p>
                <div className="card-text">
                  {destacada.contenido.length > 300 
                    ? `${destacada.contenido.substring(0, 300)}...` 
                    : destacada.contenido}
                </div>
              </div>
              <div className="mt-auto pt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {hasAdditionalImages && (
                      <Badge bg="info">
                        {destacada.imagenes.length + 1} imágenes
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {restNoticias.map(noticia => {
          const hasImages = noticia.imagenes && Array.isArray(noticia.imagenes) && noticia.imagenes.length > 0;
          
          return (
            <Col key={noticia.id}>
              <Card className="h-100 shadow-sm border-0 hover-card">
                <div className="position-relative">
                  {hasImages ? (
                    <Carousel interval={5000} indicators={false} controls={true}>
                      {noticia.imagen && (
                        <Carousel.Item>
                          <img
                            src={getImageUrl(noticia.imagen)}
                            alt={noticia.titulo}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        </Carousel.Item>
                      )}
                      
                      {noticia.imagenes.map((img, idx) => (
                        <Carousel.Item key={idx}>
                          <img
                            src={getImageUrl(img)}
                            alt={`${noticia.titulo} - Imagen ${idx + 1}`}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <div className="news-image-container">
                      <img
                        src={getImageUrl(noticia.imagen)}
                        alt={noticia.titulo}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="position-absolute bottom-0 start-0 p-3 w-100 text-white" 
                       style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                    <p className="m-0 small">
                      <i className="bi bi-calendar-event me-1"></i>
                      {formatDate(noticia.fecha)}
                    </p>
                  </div>
                </div>
                <Card.Body>
                  <h5 className="card-title">{noticia.titulo}</h5>
                  <p className="card-text">
                    {noticia.contenido.length > 100 
                      ? `${noticia.contenido.substring(0, 100)}...` 
                      : noticia.contenido}
                  </p>
                  {hasImages && (
                    <Badge bg="info" className="mb-2">
                      {noticia.imagenes.length + 1} imágenes
                    </Badge>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Noticias;