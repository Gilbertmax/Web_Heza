import React from 'react';

const ConfiguracionCliente = () => {
  return (
    <div className="container py-4">
      <h2>Configuración de la Cuenta</h2>
      <div className="card shadow">
        <div className="card-body">
          {/* Contenido de configuración */}
          <div className="mb-3">
            <label className="form-label">Cambiar Contraseña</label>
            <input type="password" className="form-control" />
          </div>
          <button className="btn btn-primary">
            <i className="fas fa-save me-2"></i>Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionCliente;