import React from 'react';

const ConfiguracionCliente = () => {
  return (
    <div className="container py-4  ">
      <h5 className="display-6 text-dark mb-4">
         <span className="text-gradient-primary">Configuración</span> 
         <span className="text-gradient-secondary"> de la Cuenta</span>
      </h5>
      <div className="card shadow ">
        <div className="card-body ">
          {/* Contenido de configuración */}
          <div className="mb-3 admin-form-group specialty-card">
            <label className="form-label">Cambiar Contraseña</label>
            <input type="password" className="form-control" />
          </div>
          <div className="text-center mt-4">
          <button className="btn btn-primary ">
            <i className="fas fa-save me-2"></i>Guardar Cambios
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionCliente;