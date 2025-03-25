import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
const Footer = () => {
  return (
    <div className="container-fluid bg-dark pt-6" style={{ marginTop: "90px" }}>
      <div className="container">
        {/* Sección de contacto */}
        <div className="row mb-6">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="d-flex align-items-center p-4">
              <i className="fas fa-map-marker-alt fa-2x text-primary mr-4"></i>
              <div>
                <h5 className="text-white mb-2">Oficinas</h5>
                <p className="text-muted mb-1">(33) 3330-5376 - Heza Guadalajara</p>
                <p className="text-muted mb-0">(322) 225-4236 - Heza Vallarta</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="d-flex align-items-center p-4">
              <i className="fas fa-envelope fa-2x text-primary mr-4"></i>
              <div>
                <h5 className="text-white mb-2">Contacto</h5>
                <a href="mailto:contacto@heza.com.mx" className="text-muted">contacto@heza.com.mx</a>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="d-flex align-items-center p-4">
              <i className="fas fa-handshake fa-2x text-primary mr-4"></i>
              <div>
                <h5 className="text-white mb-2">Nuestro Compromiso</h5>
                <p className="text-muted mb-0">Servicios profesionales y confiables</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal del footer */}
        <div className="row pt-6 border-top border-secondary">
          <div className="col-lg-3 col-md-6 mb-5">
            <Link to="/" className="d-block mb-4">
              <h1 className="text-primary font-weight-bold display-5">HEZA</h1>
            </Link>
            <p className="text-muted mb-4">Guiamos fiscalmente tu empresa</p>
            <div className="d-flex gap-3">
              <a href="https://www.facebook.com/hezaconsultoriaintegral" className="social-icon" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://x.com/HEZAConsultoria" className="social-icon" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://www.youtube.com/channel/UCwFvryoTPGgpO-1CPCIgcqA" className="social-icon" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-5">
            <h4 className="text-primary mb-4">Nosotros</h4>
            <div className="d-flex flex-column gap-2">
              {['carta-director', 'Pilares', 'MV'].map((link, index) => (
                <Link key={index} to={`/nosotros#${link}`} className="footer-link">
                  {['Carta del Director', 'Nuestros Pilares', 'Misión y Visión'][index]}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-5">
            <h4 className="text-primary mb-4">Servicios</h4>
            <div className="d-flex flex-column gap-2">
              {[
                'diagnostico-empresarial', 'asesoria-fiscal', 'asesoria-laboral-y-seguro-social',
                'legal-corporativo', 'contabilidad', 'finanzas-corporativas',
                'consultoria-y-consejos-consultivos', 'proteccion-patrimonial'
              ].map((link, index) => (
                <Link key={index} to={`/servicios/${link}`} className="footer-link">
                  {[
                    'Diagnóstico Empresarial', 'Asesoría Fiscal', 'Asesoría Laboral y Seguro Social',
                    'Legal – Corporativo', 'Contabilidad', 'Finanzas corporativas',
                    'Consultoría y consejos consultivos', 'Protección Patrimonial'
                  ][index]}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-5">
              <h4 className="text-primary mb-4">Eventos / Noticias</h4>
              <div className="d-flex flex-column gap-2">
                {['legal', 'finanzas', 'ley-federal', 'novedades', 'aviso-privacidad'].map((link, index) => (
                  <Link key={index} to={`/${link}`} className="footer-link">
                    {['Legal', 'Finanzas', 'Ley Federal', 'Novedades', 'Aviso de Privacidad'][index]}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        {/* Copyright */}
        <div className="row py-4 mt-4 border-top border-secondary">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="text-muted mb-0">
              © {new Date().getFullYear()} HEZA Consultoría Integral
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-inline-flex gap-2">
              <Link 
                to="/cliente" 
                className="btn btn-outline-primary btn-sm hover-lift"
              >
                <i className="fas fa-user me-2"></i>
                Cliente
              </Link>
              <Link 
                to="/admin" 
                className="btn btn-outline-primary btn-sm hover-lift"
              >
                <i className="fas fa-lock me-2"></i>
                Administrador
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;