import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Cliente = () => {
  const empresaInfo = {
    nombre: 'Empresa Ejemplo S.A. de C.V.',
    rfc: 'EJE210506ABC',
    industria: 'Consultoría Financiera',
    contacto: 'Juan Pérez - juan@empresa.com',
    regimenFiscal: 'Régimen General'
  };

  return (
    <div className="container py-5">
      <h1 className="text-primary mb-4">Bienvenido, {empresaInfo.nombre}</h1>
      
      <div className="row">
        <div className="col-md-3">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Información Empresa</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>RFC:</strong> {empresaInfo.rfc}
                </li>
                <li className="list-group-item">
                  <strong>Régimen Fiscal:</strong> {empresaInfo.regimenFiscal}
                </li>
                <li className="list-group-item">
                  <strong>Contacto:</strong> {empresaInfo.contacto}
                </li>
              </ul>
            </div>
          </div>
          
          <nav className="card shadow-sm">
            <div className="list-group list-group-flush">
              <Link to="documentos" className="list-group-item list-group-item-action">
                <i className="fas fa-folder-open me-2"></i>Documentos
              </Link>
              <Link to="perfil" className="list-group-item list-group-item-action">
                <i className="fas fa-building me-2"></i>Perfil Empresa
              </Link>
              <Link to="configuracion" className="list-group-item list-group-item-action">
                <i className="fas fa-cog me-2"></i>Configuración
              </Link>
            </div>
          </nav>
        </div>

        <div className="col-md-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Cliente;