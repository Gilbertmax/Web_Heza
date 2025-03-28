import React from 'react';
import ContactForm from '../../components/ContactForm';

const Contact = () => {
  return (
    <div className="container-fluid py-5 bg-light">
      <div className="container py-5">
        <div className="text-center pb-4">
          <h6 className="text-uppercase text-primary">Contáctanos</h6>
          <h1 className="display-4 text-dark mb-4">
            <span className="text-gradient-primary">Estamos aquí</span>
            <span className="text-gradient-secondary"> para ayudarte</span>
          </h1>
        </div>
        
        <div className="row g-5">
          <div className="col-lg-6">
            <ContactForm 
              title="Solicita tu Pre-diagnóstico Fiscal sin costo"
              subtitle="Completa el formulario y un especialista se pondrá en contacto contigo"
            />
          </div>
          
          <div className="col-lg-6">
            <div className="contact-info bg-white rounded-4 shadow p-5 h-100">
              <div className="mb-5">
                <h3 className="text-primary mb-4">Oficinas</h3>
                <div className="d-flex align-items-center mb-3">
                  <i className="fas fa-map-marker-alt fa-lg text-primary me-3"></i>
                  <div>
                    <p className="mb-1 fw-bold">Heza Guadalajara</p>
                    <p className="mb-0">(33) 3330-5376</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-map-marker-alt fa-lg text-primary me-3"></i>
                  <div>
                    <p className="mb-1 fw-bold">Heza Vallarta</p>
                    <p className="mb-0">(322) 225-4236</p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h3 className="text-primary mb-4">Contacto</h3>
                <div className="d-flex align-items-center mb-3">
                  <i className="fas fa-envelope fa-lg text-primary me-3"></i>
                  <a href="mailto:contacto@heza.com.mx" className="text-dark">
                    contacto@heza.com.mx
                  </a>
                </div>
              </div>

              <div className="commitment-section">
                <h3 className="text-primary mb-4">Nuestro Compromiso</h3>
                <div className="d-flex align-items-start">
                  <i className="fas fa-handshake fa-lg text-primary me-3"></i>
                  <p className="mb-0">
                    Servicios profesionales y confiables basados en experiencia técnica 
                    y valores corporativos sólidos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;