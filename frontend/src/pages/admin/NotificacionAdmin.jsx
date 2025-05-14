import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faTimes, faUser, faBuilding, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';

const NotificacionAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchSolicitudes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/admin/solicitudes-acceso', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setSolicitudes(response.data);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        setError('Error al cargar las solicitudes. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [navigate]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      await axios.post(`/api/admin/solicitudes-acceso/${id}/aprobar`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSolicitudes(solicitudes.map(sol => 
        sol.id === id ? { ...sol, estado: 'aprobada' } : sol
      ));
      
      if (selectedSolicitud?.id === id) {
        setSelectedSolicitud({ ...selectedSolicitud, estado: 'aprobada' });
      }
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      setError('Error al aprobar la solicitud. Por favor, intente nuevamente.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      await axios.post(`/api/admin/solicitudes-acceso/${id}/rechazar`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSolicitudes(solicitudes.map(sol => 
        sol.id === id ? { ...sol, estado: 'rechazada' } : sol
      ));
      
      if (selectedSolicitud?.id === id) {
        setSelectedSolicitud({ ...selectedSolicitud, estado: 'rechazada' });
      }
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      setError('Error al rechazar la solicitud. Por favor, intente nuevamente.');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSucursalName = (sucursal) => {
    return sucursal === 'vallarta' ? 'HEZA Vallarta' : 'HEZA Guadalajara';
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="display-6 text-dark mb-0">
              <span className="text-gradient-primary">Solicitudes de </span>
              <span className="text-gradient-secondary">Acceso</span>
            </h2>
            <Link 
              to="/admin/dashboard" 
              className="btn btn-outline-primary d-flex align-items-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} size="sm" />
              Volver al Dashboard
            </Link>
          </div>
        </div>

        {loading ? (
          <Loading type="spinner" admin={true} />
        ) : error ? (
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {error}
            </div>
          </div>
        ) : (
          <>
            <div className="col-md-5 col-lg-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Lista de Solicitudes</h5>
                </div>
                <div className="card-body p-0">
                  {solicitudes.length === 0 ? (
                    <div className="p-4 text-center text-muted">
                      No hay solicitudes pendientes
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {solicitudes.map((solicitud) => (
                        <button
                          key={solicitud.id}
                          className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedSolicitud?.id === solicitud.id ? 'active' : ''}`}
                          onClick={() => setSelectedSolicitud(solicitud)}
                        >
                          <div>
                            <div className="fw-bold">{solicitud.nombre}</div>
                            <small>{solicitud.tipo === 'client' ? 'Cliente' : 'Usuario'} - {formatDate(solicitud.fechaSolicitud)}</small>
                          </div>
                          <span className={`badge ${solicitud.estado === 'pendiente' ? 'bg-warning' : solicitud.estado === 'aprobada' ? 'bg-success' : 'bg-danger'}`}>
                            {solicitud.estado === 'pendiente' ? 'Pendiente' : solicitud.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-7 col-lg-8">
              {selectedSolicitud ? (
                <div className="card shadow">
                  <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Detalles de la Solicitud</h5>
                    <span className={`badge ${selectedSolicitud.estado === 'pendiente' ? 'bg-warning' : selectedSolicitud.estado === 'aprobada' ? 'bg-success' : 'bg-danger'}`}>
                      {selectedSolicitud.estado === 'pendiente' ? 'Pendiente' : selectedSolicitud.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h6 className="text-primary mb-3">
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          Información Personal
                        </h6>
                        <dl className="row">
                          <dt className="col-sm-4">Nombre:</dt>
                          <dd className="col-sm-8">{selectedSolicitud.nombre}</dd>

                          <dt className="col-sm-4">Email:</dt>
                          <dd className="col-sm-8">{selectedSolicitud.email}</dd>

                          <dt className="col-sm-4">Teléfono:</dt>
                          <dd className="col-sm-8">{selectedSolicitud.telefono}</dd>

                          <dt className="col-sm-4">Tipo:</dt>
                          <dd className="col-sm-8">{selectedSolicitud.tipo === 'client' ? 'Cliente' : 'Usuario'}</dd>
                        </dl>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-primary mb-3">
                          <FontAwesomeIcon icon={faBuilding} className="me-2" />
                          Información Empresarial
                        </h6>
                        <dl className="row">
                          <dt className="col-sm-4">Empresa:</dt>
                          <dd className="col-sm-8">{selectedSolicitud.empresa}</dd>

                          {selectedSolicitud.tipo === 'client' && (
                            <>
                              <dt className="col-sm-4">RFC:</dt>
                              <dd className="col-sm-8">{selectedSolicitud.rfc}</dd>

                              <dt className="col-sm-4">Sucursal:</dt>
                              <dd className="col-sm-8">{getSucursalName(selectedSolicitud.sucursal)}</dd>
                            </>
                          )}

                          <dt className="col-sm-4">Fecha:</dt>
                          <dd className="col-sm-8">{formatDate(selectedSolicitud.fechaSolicitud)}</dd>
                        </dl>
                      </div>
                    </div>

                    {selectedSolicitud.estado === 'pendiente' && (
                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleReject(selectedSolicitud.id)}
                          disabled={processingId === selectedSolicitud.id}
                        >
                          <FontAwesomeIcon icon={faTimes} className="me-2" />
                          Rechazar
                        </button>
                        <button 
                          className="btn btn-success"
                          onClick={() => handleApprove(selectedSolicitud.id)}
                          disabled={processingId === selectedSolicitud.id}
                        >
                          <FontAwesomeIcon icon={faCheck} className="me-2" />
                          Aprobar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card shadow">
                  <div className="card-body text-center p-5">
                    <h4 className="text-muted mb-4">Seleccione una solicitud para ver los detalles</h4>
                    <p className="text-muted">
                      Haga clic en una solicitud de la lista para ver toda la información proporcionada por el usuario.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificacionAdmin;