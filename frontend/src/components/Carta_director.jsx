import React from 'react';
import directorImg from '../assets/img/img-director-768x641.png';

const CartaDirector = () => {
  return (
    <div className="container-fluid py-5 bg-light-pattern">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-7 mb-5 mb-lg-0" data-aos="fade-right">
            <div className="pe-lg-5 position-relative">
              <span className="section-badge bg-primary text-white mb-4">Liderazgo</span>
              <h2 className="display-3 text-dark mb-4">
                Carta del<br />
                <span className="text-gradient-primary">Director</span>
              </h2>
              
              <blockquote className="blockquote-2 mb-5">
                <p className="lead text-dark font-italic">
                  "Nuestra empresa es reconocida por su integridad, confiabilidad y conducta ética."
                </p>
              </blockquote>

              <div className="mb-5">
                <p className="h5 text-muted mb-4">
                  Los servicios que ofrecemos son de alta calidad y calidez, dignos de confianza porque están sustentados 
                  en valores corporativos como son Integridad, Responsabilidad y Conducta ética.
                </p>
              </div>

              <div className="d-flex align-items-center">
                <div className="mr-4">
                  <h3 className="text-dark mb-1">Ángel Hernández</h3>
                  <p className="text-primary mb-0">Director General</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5" data-aos="fade-left">
            <div className="position-relative director-frame">
              <img 
                src={directorImg} 
                alt="Ángel Hernández - Director General" 
                className="img-fluid rounded-lg shadow-xl hover-transform"
              />
              <div className="frame-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartaDirector;