import React from 'react';
import cliente1 from '../assets/img/cliente-1.png';
import cliente2 from '../assets/img/cliente-2.png';
import cliente3 from '../assets/img/cliente-3.png';
import cliente4 from '../assets/img/cliente-4.png';
import cliente5 from '../assets/img/cliente-5.png';
import cliente6 from '../assets/img/cliente-6.png';
import cliente7 from '../assets/img/cliente-7.png';
import cliente8 from '../assets/img/cliente-8.png';

const Clientes = () => {
  const clientes = [cliente1, cliente2, cliente3, cliente4, cliente5, cliente6, cliente7, cliente8];

  return (
    <div className="container-fluid py-6 bg-secondary">
      <div className="container py-4">
        <div className="section-header mb-5">
          <h2 className="display-5 text-white text-center mb-3">
            Nuestros Clientes
          </h2>
          <div className="title-divider"></div>
          <p className="lead text-light text-center mb-0">
            Empresas que han confiado en nuestra experiencia
          </p>
        </div>

        <div className="client-grid ">
          {clientes.map((cliente, index) => (
            <div className="client-card specialty-card" key={index}>
              <img 
                src={cliente} 
                alt={`Cliente ${index + 1}`} 
                className="client-logo" 
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <p className="text-light mb-0 small opacity-75">
            + de 300 empresas asesoradas
          </p>
        </div>
      </div>
    </div>
  );
};


export default Clientes;