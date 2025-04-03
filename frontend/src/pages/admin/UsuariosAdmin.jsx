import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';



const Register = ({ fullScreen }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setNumero] = useState('');
  const [puesto, setPuesto]= useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      <div className="register-form">
        <h2 className="text-center mb-4">Registro de Usuario</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="auth-buttons">
            <button type="submit" className="btn-auth user" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Register.propTypes = {
  fullScreen: PropTypes.bool,
};

export default Register;



