import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './Loading.css';

const Loading = ({ 
  message = 'Cargando...',
  type = 'spiral',
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  textPosition = 'below',
  progress,
  admin = false,
  showLogin = false
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (userType) => {
    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!email || !password) {
        throw new Error('Por favor complete todos los campos');
      }

      if (userType === 'client') {
        navigate('/clientes/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form className="login-form">
      <div className="form-group">
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="auth-buttons">
        <button 
          type="button" 
          className="btn-auth user"
          onClick={() => handleAuth('user')}
          disabled={loading}
        >
          {loading ? 'Verificando...' : 'Acceder como Usuario'}
        </button>
        
        <button 
          type="button" 
          className="btn-auth client"
          onClick={() => handleAuth('client')}
          disabled={loading}
        >
          {loading ? 'Verificando...' : 'Acceder como Cliente'}
        </button>
      </div>

      <div className="access-link">
        <a 
          href="https://wa.me/523333305376" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          ¿No tienes acceso? Solicítalo aquí
        </a>
      </div>
    </form>
  );

  const renderSpinner = () => {
    switch(type) {
      case 'dots':
        return (
          <div className="dots-container">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="bouncing-dot" 
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      
      case 'progress':
        return (
          <div className="progress-loader">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            >
              <span className="progress-text">{progress}%</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="spiral-loader">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="spiral-track" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                className="spiral-path" 
                strokeDasharray="180 200"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div 
      className={`loading-container 
        ${admin ? 'admin' : ''} 
        ${fullScreen ? 'full-screen' : ''}
        ${textPosition}`}
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <div className={`spinner ${type} ${size} ${color}`}>
        {showLogin ? renderLoginForm() : renderSpinner()}
      </div>
      
      {!showLogin && message && (
        <div className="loading-text">
          {message}
          {type === 'progress' && (
            <span className="progress-percent">{progress}%</span>
          )}
        </div>
      )}
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['spiral', 'dots', 'progress']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'monochrome']),
  fullScreen: PropTypes.bool,
  textPosition: PropTypes.oneOf(['below', 'right', 'hidden']),
  progress: PropTypes.number,
  admin: PropTypes.bool,
  showLogin: PropTypes.bool
};

export default Loading;