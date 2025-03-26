import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading/Loading';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = [
          {
            id: 1,
            titulo: 'Seminario de Actualización Fiscal',
            fecha: '2024-04-20',
            tipo: 'Próximo',
            ubicacion: 'Guadalajara, Jalisco',
            imagen: 'https://via.placeholder.com/800x400'
          },
          // ... más eventos
        ];
        setEventos(mockData);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container py-5">
      <h1 className="text-primary mb-4">Próximos Eventos</h1>
      
      {/* Evento destacado */}
      <div className="card mb-5 shadow">
        <img 
          src={eventos.find(e => e.tipo === 'Próximo')?.imagen} 
          className="card-img-top" 
          alt="Evento destacado" 
          style={{ height: '400px', objectFit: 'cover' }}
        />
        <div className="card-body">
          <h2>{eventos.find(e => e.tipo === 'Próximo')?.titulo}</h2>
          <div className="mb-3">
            <span className="badge bg-primary">{eventos.find(e => e.tipo === 'Próximo')?.tipo}</span>
          </div>
          <p className="text-muted">{eventos.find(e => e.tipo === 'Próximo')?.fecha}</p>
          <p>{eventos.find(e => e.tipo === 'Próximo')?.ubicacion}</p>
          <Link to="/" className="btn btn-primary">
            Registrarse
          </Link>
        </div>
      </div>

      {/* Eventos pasados */}
      <h2 className="text-primary mb-4">Eventos Anteriores</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {eventos.filter(e => e.tipo === 'Pasado').map(evento => (
          <div key={evento.id} className="col">
            <div className="card h-100 shadow-sm">
              <img 
                src={evento.imagen} 
                className="card-img-top" 
                alt={evento.titulo}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{evento.titulo}</h5>
                <p className="text-muted">{evento.fecha}</p>
                <Link 
                  to={`/eventos/${evento.id}`} 
                  className="btn btn-outline-primary"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Eventos;