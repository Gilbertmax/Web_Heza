import React, { useState } from 'react';
import axios from 'axios';
import './AccessRequest.css';

const AccessRequest = () => {
  const [requestType, setRequestType] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    telefono: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const endpoint = requestType === 'client' 
        ? '/api/auth/request-client-access' 
        : '/api/auth/request-user-access';
      
      const response = await axios.post(endpoint, formData);
      setSuccess(response.data.message);
      setFormData({
        nombre: '',
        empresa: '',
        telefono: '',
        email: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="access-request-container">
      <div className="access-request-form">
        <h2 className="text-center">Solicitar Acceso</h2>
        
        {!requestType ? (
          <div className="access-type-selection">
            <p className="text-center mb-4">Selecciona el tipo de acceso que deseas solicitar:</p>
            
            <button 
              className="btn btn-primary w-100 mb-3"
              onClick={() => setRequestType('client')}
            >
              Acceso como Cliente
            </button>
            
            <button 
              className="btn btn-secondary w-100"
              onClick={() => setRequestType('user')}
            >
              Acceso como Usuario
            </button>
          </div>
        ) : (
          <>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <form onSubmit={handleSubmit}>
              {requestType === 'user' && (
                <div className="form-group mb-3">
                  <label htmlFor="nombre">Nombre Completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              
              <div className="form-group mb-3">
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  className="form-control"
                  value={formData.empresa}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  className="form-control"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => setRequestType('')}
                >
                  Volver a selección de tipo de acceso
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AccessRequest;