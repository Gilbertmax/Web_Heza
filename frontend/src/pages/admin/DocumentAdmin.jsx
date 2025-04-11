import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faArrowLeft} from '@fortawesome/free-solid-svg-icons';

const DetalleDocumento = () => {

  
  const documento = {
    id: 1,
    nombre: `Documento`,
    tipo: 'PDF',
    fechaSubida: '2024-03-15',
    tamaño: '2.5 MB',
    descripción: 'Documento de ejemplo con detalles importantes',
    urlDescarga: '#'
  };

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4 ">
          <h2 className="display- text-dark mb-2">
             <span className="text-gradient-secondary"> {documento.nombre}</span>
          </h2>
          <Link 
            to="/admin/dashboard" 
            className="btn btn-outline-primary d-flex align-items-center gap-2 custom-link"
          >
                <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="arrow-icon" 
                    size="lg" 
                />
             Volver
          </Link>


          </div>
          
          <dl className="row ">
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
            <a 
              href={documento.urlDescarga} 
              className="btn btn-primary"
              download
            >
              <i className="fas fa-download me-2"></i>
              Descargar Documento
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleDocumento;