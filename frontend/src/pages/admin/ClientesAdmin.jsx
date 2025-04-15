import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './admin.css';


const RC = ({ fullScreen }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setNumero] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [rfc, setRfc] = useState('');
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
      const response = await fetch('http://localhost:5000/api/clientes/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: name, email, password, telefono, empresa, rfc })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Usuario registrado con éxito');
        navigate('/Clientes/dashboard'); // Redirigir después del registro
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
            <span className="text-gradient-secondary"> de Cliente </span>
        </h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <div  className="admin-login-form mb-3 col-md-6 form-floating row ">
        <form  onSubmit={handleRegister}>
        <div className="row">
          {/* Columna izquierda */}
           <div className="col-md-6 admin-form-group">
              <div className="mb-3">
                    <label htmlFor="name">Nombre</label>
                    <input
                    type="text"
                    id="name"
                    className="form-control text-dark"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
               </div>
               <div className="mb-3 ">
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
                <div className="mb-3">
                     <label htmlFor="password">Contraseña</label>
                     <div className="position-relative">
                        <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control text-dark"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                        <button
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y me-2 p-0 bg-transparent border-0"
                        onClick={togglePasswordVisibility}
                        aria-label="Mostrar contraseña"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-warning" />
                        </button>
                    </div>
                </div>
            </div>
        {/* Columna derecha */}
            <div className="col-md-6 admin-form-group">
                <div className="mb-3">
                     <label htmlFor="telefono">Teléfono</label>
                     <input
                     type="text"
                     id="telefono"
                     className="form-control text-dark"
                     value={telefono}
                     onChange={(e) => setNumero(e.target.value)}
                     required
                     />
                </div>
                <div className="mb-3">
                     <label htmlFor="empresa">Nombre de la Empresa</label>
                     <input
                     type="text"
                     id="empresa"
                     className="form-control text-dark"
                     value={empresa}
                     onChange={(e) => setEmpresa(e.target.value)}
                     required
                     />
                </div>
                <div className="mb-3">
                    <label htmlFor="rfc">RFC</label>
                    <input
                    type="text"
                    id="rfc"
                    className="form-control text-dark"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value)}
                    required
                    />
                </div>
            </div>
          </div>

          {/* Botón */}
           <div className="text-center mt-4">
              <button
              type="submit"
              className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-hover"
              disabled={isLoading}
              >
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

RC.propTypes = {
  fullScreen: PropTypes.bool,
};

export default RC;



