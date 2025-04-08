import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const DetalleDocumento = () => {
  const documento = {
    id: 1,
    empresa: 'empresa 01',
    nombre: `Documento 1`,
    tipo: 'PDF',
    fechaSubida: '2024-03-15',
    tamaño: '2.5 MB',
    descripción: 'Documento de ejemplo con detalles importantes',
    urlDescarga: '#'
  };


  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="bg-white shadow-sm p-3"
        style={{
          width: '340px',
          height: '100vh',
          position:'sticky',
          top: 0
        }}
      >
        <nav className="card shadow-sm h-100">
          <div className="list-group list-group-flush">
            <Link to="/admin/documentos" className="list-group-item list-group-item-action specialty-card">
              <span className="section-badge bg-primary-soft text-primary fas fa-folder-open"> Empresa 1 </span>
            </Link>
            <Link to="/admin/perfil" className="list-group-item list-group-item-action specialty-card">
              <span className="section-badge bg-primary-soft text-primary fas fa-folder-open"> Empresa 2 </span>
            </Link>
            <Link to="/admin/configuracion" className="list-group-item list-group-item-action specialty-card">
              <span className="section-badge bg-primary-soft text-primary fas fa-folder-open"> Empresa 3 </span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Contenido del documento */}
      <div className="flex-grow-1 p-4">
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-dark mb-0">
                <span className="text-gradient-secondary">{documento.nombre}</span>
              </h2>
              <Link
                to="/admin/dashboard"
                className="btn btn-outline-primary d-flex align-items-center gap-2 custom-link"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="arrow-icon" size="lg" />
                Volver
              </Link>
            </div>

            <dl className="row">
              <dt className="col-sm-3">Tipo de Archivo:</dt>
              <dd className="col-sm-9">{documento.tipo}</dd>

              <dt className="col-sm-3">Fecha de Subida:</dt>
              <dd className="col-sm-9">{documento.fechaSubida}</dd>

              <dt className="col-sm-3">Tamaño:</dt>
              <dd className="col-sm-9">{documento.tamaño}</dd>

              <dt className="col-sm-3">Descripción:</dt>
              <dd className="col-sm-9">{documento.descripción}</dd>
            </dl>

            <div className="mt-4">
              <a href={documento.urlDescarga} className="btn btn-primary" download>
                <i className="fas fa-download me-2"></i>
                Descargar Documento
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleDocumento;
