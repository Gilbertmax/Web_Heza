import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';



const Register = ({ fullScreen }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setNumero] = useState('');
  const [puesto, setPuesto]= useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, telefono, puesto}),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Usuario registrado con éxito');
        navigate('/Usuarios/dashboard'); // Redirigir después del registro
      } else {
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
      console.error('Register error:', err);
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
        <div  className="admin-login-form mb-4 col-md-6 form-floating ">
        <form  onSubmit={handleRegister}>

          <div className=" admin-form-group ">
            <label htmlFor="name"> Nombre</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              
            />
          </div>
          
          <div className=" admin-form-group">
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

          <div className=" admin-form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-container">
                <input                
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
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

          <div className=" admin-form-group">
            <label htmlFor="number">Telefono</label>
            <input
              type="numer"
              id="telefon numer"
              className="form-control"
              value={telefono}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </div>

          <div className="  admin-form-group">
            <label htmlFor="number">Puesto</label>
            <input
              type="Puesto"
              id="puesto"
              className="form-control"
              value={puesto}
              onChange={(e) => setPuesto(e.target.value)}
              required
            />
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

Register.propTypes = {
  fullScreen: PropTypes.bool,
};

export default Register;



