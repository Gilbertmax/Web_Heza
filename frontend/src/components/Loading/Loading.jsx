// Simplify the Loading component to focus on core functionality
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './Loading.css';

const Loading = ({ fullScreen, message, showLogin = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage or context
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to appropriate dashboard based on user role
        navigate('/clientes/dashboard');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (showLogin) {
    return (
      <div className={`loading-container ${fullScreen ? 'full-screen' : ''}`}>
        <div className="login-form">
          <h2 className="text-center mb-4">Acceso</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="auth-buttons">
              <button 
                type="submit" 
                className="btn-auth user"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`loading-container ${fullScreen ? 'full-screen' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      {message && <div className="loading-text">{message}</div>}
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
  showLogin: PropTypes.bool
};

export default Loading;