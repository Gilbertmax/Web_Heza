import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLoading.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AdminLoading = ({ showLogin = false, fullScreen = true }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmailPrefix, setResetEmailPrefix] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await axios.post('/api/auth/admin/login', {
      email: `${username}@heza.com.mx`,
      password: password,
    });

    const { token, admin } = response.data;

    if (admin.rol !== 'admin') {
      throw new Error('No tienes permisos de administrador.');
    }

    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(admin));
    navigate('/admin/dashboard');
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
  } finally {
    setLoading(false);
  }
};

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let fullEmail = resetEmailPrefix;
      
      if (!resetEmailPrefix.includes('@')) {
        fullEmail = `${resetEmailPrefix}@heza.com.mx`;
      }
      
      console.log('Requesting password reset for:', fullEmail);
      
      const response = await axios.post('/api/auth/request-password-reset', { 
        email: fullEmail 
      });
      
      console.log('Password reset response:', response.data);
      setResetSent(true);
    } catch (err) {
      console.error('Password reset error:', err);
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('No se pudo conectar con el servidor. Por favor, asegúrate de que el servidor backend esté en ejecución.');
      } else {
        setError(err.response?.data?.error || 'Error al solicitar restablecimiento. Intenta de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!showLogin) {
    return (
      <div className={`admin-loading-container ${fullScreen ? 'admin-full-screen' : ''}`}>
        <div className="admin-spiral-spinner">
          <div className="admin-spiral-circle"></div>
        </div>
        <p className="admin-loading-text">Cargando panel administrativo...</p>
      </div>
    );
  }

  return (
    <div className="admin-loading-container">
      <div className="admin-login-form">
        <h2 className="text-center">Acceso Administrativo</h2>
        
        {!showResetForm ? (
          <>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="admin-form-group">
                <label htmlFor="username">Usuario</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="password">Contraseña</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <FontAwesomeIcon 
                      icon={showPassword ? faEyeSlash : faEye} 
                      className="eye-icon"
                    />
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => navigate('/admin/registro')}
                >
                  Registrarse
                </button>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => setShowResetForm(true)}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {resetSent ? (
              <div className="alert alert-success">
                Se ha enviado un correo con instrucciones para restablecer tu contraseña.
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => {
                      setShowResetForm(false);
                      setResetSent(false);
                    }}
                  >
                    Volver al inicio de sesión
                  </button>
                </div>
              </div>
            ) : (
              <>
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleResetPassword}>
                  <div className="admin-form-group">
                    <label htmlFor="resetEmail">Correo Electrónico</label>
                    <div className="email-input-container">
                      <input
                        type="text"
                        id="resetEmailPrefix"
                        className="form-control"
                        value={resetEmailPrefix}
                        onChange={(e) => setResetEmailPrefix(e.target.value)}
                        placeholder="usuario"
                        required
                      />
                      <span className="email-domain">@heza.com.mx</span>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Restablecer Contraseña'}
                  </button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() => setShowResetForm(false)}
                    >
                      Volver al inicio de sesión
                    </button>
                  </div>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLoading;