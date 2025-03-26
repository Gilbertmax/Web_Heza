import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading/Loading';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = [
          {
            id: 1,
            titulo: 'Nueva Reforma Fiscal 2024',
            contenido: 'Actualizaciones importantes en materia fiscal...',
            fecha: '2024-03-15',
            imagen: 'https://via.placeholder.com/800x400',
            destacada: true
          },
          // ... más noticias
        ];
        setNoticias(mockData);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container py-5">
      <h1 className="text-primary mb-4">Últimas Noticias</h1>
      
      {/* Noticia destacada */}
      <div className="card mb-5 shadow">
        <img 
          src={noticias.find(n => n.destacada)?.imagen} 
          className="card-img-top" 
          alt="Destacada" 
          style={{ height: '400px', objectFit: 'cover' }}
        />
        <div className="card-body">
          <h2>{noticias.find(n => n.destacada)?.titulo}</h2>
          <p className="text-muted">{noticias.find(n => n.destacada)?.fecha}</p>
          <p>{noticias.find(n => n.destacada)?.contenido}</p>
          <Link to="/" className="btn btn-primary">
            Leer más
          </Link>
        </div>
      </div>

      {/* Listado de noticias */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {noticias.filter(n => !n.destacada).map(noticia => (
          <div key={noticia.id} className="col">
            <div className="card h-100 shadow-sm">
              <img 
                src={noticia.imagen} 
                className="card-img-top" 
                alt={noticia.titulo}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{noticia.titulo}</h5>
                <p className="card-text text-truncate">{noticia.contenido}</p>
                <Link 
                  to={`/noticias/${noticia.id}`} 
                  className="btn btn-outline-primary"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Noticias;