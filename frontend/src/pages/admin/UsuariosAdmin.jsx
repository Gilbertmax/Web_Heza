import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './admin.css';

const UsuariosAdmin = ({ fullScreen }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('empleado');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No estás autorizado. Por favor inicia sesión.');
        navigate('/admin/login');
        return;
      }

      const userData = { 
        username,
        nombre: name, 
        email, 
        password, 
        telefono, 
        rol,
        activo: 1
      };

      // Se elimina el bloque condicional que agregaba campos adicionales

      await axios.post('/api/auth/register', userData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Usuario registrado con éxito');
      
      setName('');
      setEmail('');
      setPassword('');
      setTelefono('');
      setRol('empleado');
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Register error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Error al registrar usuario');
      } else {
        setError('Error de conexión al servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`register-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="text-center register-form form-card bg-white rounded-20 shadow-lg row justify-content-center col-lg-15 bg-white rounded-4 shadow-lg p-5 row g-8">
      <h5 className="display-6 text-dark mb-4">
            <span className="text-gradient-primary">Registro</span>
            <span className="text-gradient-secondary"> de Usuario </span>
        </h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <div  className="admin-login-form mb-4 col-md-6 form-floating">

        <form  onSubmit={handleRegister}>
        <div className="row">
          <div className="col-md-6 admin-form-group">
            <div className=" mb-3 ">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                className="form-control text-dark"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="name"> Nombre completo</label>
              <input
                type="text"
                id="name"
                className="form-control text-dark"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control text-dark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className=" mb-3">
              <label htmlFor="password">Contraseña</label>
              <div className="password-input-container">
                  <input                
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control text-dark"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
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
          </div>
          <div className="col-md-6 admin-form-group">
            <div className=" mb-3">
              <label htmlFor="telefono">Telefono</label>
              <input
                type="tel"
                id="telefono"
                className="form-control text-dark"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            
            <div className="mb-3">
              <label htmlFor="rol">Rol</label>
              <select
                id="rol"
                className="form-control text-dark"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
              >
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            </div>
        </div>  
          <div className="mb-5 mr-4 mt-4">
            <button type="submit" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-hover" disabled={isLoading}>
            <i className="fas fa-arrow-right ms-2"></i>
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

UsuariosAdmin.propTypes = {
  fullScreen: PropTypes.bool,
};

export default UsuariosAdmin;
