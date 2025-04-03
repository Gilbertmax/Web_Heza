import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './AdminLoading.css';

const AdminLoading = ({ 
  message = 'Verificando credenciales administrativas...',
  type = 'spiral',
  size = 'large',
  color = 'primary',
  fullScreen = true,
  textPosition = 'below',
  progress,
  showLogin = true
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store admin data in localStorage or context
        localStorage.setItem('admin', JSON.stringify(data.admin));
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Credenciales administrativas inválidas');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
      console.error('Admin login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin-specific loading spinner
  const renderLoadingSpinner = () => (
    <div className="admin-spinner">
      {type === 'spiral' && (
        <div className="admin-spiral-spinner">
          <div className="admin-spiral-circle"></div>
        </div>
      )}
      {type === 'dots' && (
        <div className="admin-dots-spinner">
          <div className="admin-dot admin-dot1"></div>
          <div className="admin-dot admin-dot2"></div>
          <div className="admin-dot admin-dot3"></div>
        </div>
      )}
      {type === 'progress' && (
        <div className="admin-progress-bar">
          <div 
            className="admin-progress-fill" 
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
      )}
    </div>
  );

  if (showLogin) {
    return (
      <div className={`admin-loading-container ${fullScreen ? 'admin-full-screen' : ''}`}>
        <div className="admin-login-form">
          <h2 className="text-center mb-4">Acceso Administrativo</h2>
          {error && <div className="admin-alert admin-alert-danger">{error}</div>}
          <form onSubmit={handleAdminLogin}>
            <div className="admin-form-group">
              <label htmlFor="adminEmail">Email Administrativo</label>
              <input
                type="email"
                id="adminEmail"
                placeholder="admin@heza.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="adminPassword">Contraseña</label>
              <input
                type="password"
                id="adminPassword"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="admin-auth-buttons">
              <button 
                type="submit" 
                className="admin-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Acceder como Administrador'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`admin-loading-container ${fullScreen ? 'admin-full-screen' : ''}`}
      role="status"
      aria-live="polite"
    >
      {renderLoadingSpinner()}
      {message && (
        <div className={`admin-loading-text ${textPosition}`}>
          {message}
        </div>
      )}
    </div>
  );
};

AdminLoading.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['spiral', 'dots', 'progress']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'monochrome']),
  fullScreen: PropTypes.bool,
  textPosition: PropTypes.oneOf(['below', 'right', 'hidden']),
  progress: PropTypes.number,
  showLogin: PropTypes.bool
};

export default AdminLoading;