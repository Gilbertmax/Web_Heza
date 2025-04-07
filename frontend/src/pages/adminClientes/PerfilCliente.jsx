import React, { useState } from 'react';

const PerfilCliente = () => {
  const [empresa, setEmpresa] = useState({
    nombre: 'Empresa Ejemplo S.A. de C.V.',
    rfc: 'EJE210506ABC',
    direccion: 'Av. Ejemplo 123, Guadalajara',
    telefono: '33 1234 5678',
    email: 'contacto@empresa.com'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para guardar cambios
  };

  return (
    <div className="container py-4">
      <h2 className="display-7 text-dark mb-4">
          <span className="text-gradient-primary">Perfil de </span>
          <span className="text-gradient-secondary"> la Empresa</span>
      </h2> 
      <div className="card shadow specialty-card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6 admin-form-group">
                <label className="form-label">Nombre de la Empresa</label>
                <input
                  type="text"
                  className="form-control"
                  value={empresa.nombre}
                  onChange={(e) => setEmpresa({...empresa, nombre: e.target.value})}
                />
              </div>
              <div className="col-md-6 admin-form-group">
                <label className="form-label">RFC</label>
                <input
                  type="text"
                  className="form-control"
                  value={empresa.rfc}
                  readOnly
                />
              </div>
              <div className="col-12 admin-form-group">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  value={empresa.direccion}
                  onChange={(e) => setEmpresa({...empresa, direccion: e.target.value})}
                />
              </div>
              <div className="col-md-6 admin-form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  value={empresa.telefono}
                  onChange={(e) => setEmpresa({...empresa, telefono: e.target.value})}
                />
              </div>
              <div className="col-md-6 admin-form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={empresa.email}
                  onChange={(e) => setEmpresa({...empresa, email: e.target.value})}
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Guardar Cambios
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerfilCliente;