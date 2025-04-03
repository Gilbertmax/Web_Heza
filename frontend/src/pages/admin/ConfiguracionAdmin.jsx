import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle } from 'react-feather';

const ConfiguracionAdmin = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordSection, setPasswordSection] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/auth/profile');
        const { nombre, email, telefono } = response.data;
        setUserData(prevState => ({
          ...prevState,
          nombre,
          email,
          telefono: telefono || ''
        }));
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Error al cargar los datos del perfil'
        });
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      setLoading(true);
      const { nombre, email, telefono } = userData;
      
      await axios.put('/api/auth/profile', {
        nombre,
        email,
        telefono
      });
      
      setMessage({
        type: 'success',
        text: 'Información de perfil actualizada correctamente'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error al actualizar el perfil'
      });
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    const { currentPassword, newPassword, confirmPassword } = userData;
    
    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Las contraseñas nuevas no coinciden'
      });
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage({
        type: 'error',
        text: 'La contraseña debe tener al menos 8 caracteres'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      setMessage({
        type: 'success',
        text: 'Contraseña actualizada correctamente'
      });
      
      // Clear password fields
      setUserData(prevState => ({
        ...prevState,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error al actualizar la contraseña'
      });
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-lg-9 p-6">
      <div className="mb-6">
        <h1 className="display-7 text-dark mb-4">
          <span className="text-gradient-primary">Configuración </span>
          <span className="text-gradient-secondary">de Cuenta</span>
        </h1>
        <h4 className="section-subtitle text-primary mb-4">
          Actualiza tu información de contacto y seguridad
        </h4>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'} mb-4 d-flex align-items-center`}>
          {message.type === 'error' ? 
            <AlertCircle size={20} className="me-2" /> : 
            <CheckCircle size={20} className="me-2" />
          }
          {message.text}
        </div>
      )}

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="card-title">Información de Contacto</h5>
              <p className="text-muted small">Actualiza tu información personal y de contacto</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={userData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">
                    Este correo se utilizará para notificaciones y recuperación de contraseña.
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="telefono" className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefono"
                    name="telefono"
                    value={userData.telefono}
                    onChange={handleChange}
                    placeholder="Ej. 33 1234 5678"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="card-title">Seguridad</h5>
              <p className="text-muted small">Actualiza tu contraseña para mantener tu cuenta segura</p>
            </div>
            <div className="card-body">
              {!passwordSection ? (
                <div className="text-center py-4">
                  <p className="mb-4">Cambia tu contraseña periódicamente para mantener tu cuenta segura.</p>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setPasswordSection(true)}
                  >
                    Cambiar Contraseña
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordUpdate}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Contraseña Actual</label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={userData.newPassword}
                      onChange={handleChange}
                      required
                      minLength="8"
                    />
                    <div className="form-text">
                      La contraseña debe tener al menos 8 caracteres.
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setPasswordSection(false);
                        setUserData(prevState => ({
                          ...prevState,
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        }));
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionAdmin;