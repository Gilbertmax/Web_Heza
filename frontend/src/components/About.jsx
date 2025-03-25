import React from 'react';
import { Link } from 'react-router-dom';
import aboutImage from '../assets/img/img-consultoria.png';

const About = () => {
  const especializaciones = [
    { nombre: 'Fiscal', icono: 'fa-balance-scale' },
    { nombre: 'Contabilidad', icono: 'fa-calculator' },
    { nombre: 'Laboral y seguro social', icono: 'fa-users' },
    { nombre: 'Finanzas corporativas', icono: 'fa-chart-line' },
    { nombre: 'Legal-corporativo', icono: 'fa-gavel' },
    { nombre: 'Back Office', icono: 'fa-cogs' },
    { nombre: 'Protección patrimonial', icono: 'fa-shield-alt' }
  ];

  return (
    <div className="container-fluid py-5 bg-light-pattern">
      <div className="container py-5">
        {/* Sección principal */}
        <div className="row align-items-center mb-lg-5 section-divider">
          <div className="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right">
            <div className="image-wrapper">
              <img 
                className="img-fluid rounded-lg main-image" 
                src={aboutImage} 
                alt="Equipo HEZA"
              />
              <div className="image-border"></div>
            </div>
          </div>
          
          <div className="col-lg-6" data-aos="fade-left">
            <div className="ps-lg-4">
              <span className="section-badge bg-primary-soft text-primary mb-3">
                Sobre nosotros
              </span>
              <h1 className="display-3 text-dark mb-4">
                <span className="text-gradient-primary">HEZA</span> Consultoría
                <span className="text-gradient-secondary"> Integral</span>
              </h1>
              
              <p className="lead text-muted mb-4 highlighted-text">
                Transformamos la gestión empresarial mediante soluciones integrales que 
                <span className="highlight"> impulsan el crecimiento sostenible</span> y maximizan 
                la rentabilidad de tu organización.
              </p>

              <div className="mb-5">
                <h4 className="section-subtitle text-primary mb-4">
                  Especialización estratégica
                </h4>
                <div className="row g-3">
                  {especializaciones.map((especialidad, index) => (
                    <div className="col-md-6" key={index}>
                      <div className="specialty-card">
                        <i className={`fas ${especialidad.icono} icon-primary`}></i>
                        <h5 className="mb-0">{especialidad.nombre}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link 
                to="/servicios" 
                className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-hover"
              >
                Descubre nuestro método
                <i className="fas fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Sección de estadísticas */}
        <div className="row mt-5 pt-5 bg-dark-soft rounded-3xl py-5 section-divider" data-aos="fade-up">
          <div className="col-12 text-center mb-5">
            <h2 className="display-5 text-white mb-4">
              Potenciamos tu éxito con<br />
              <span className="text-gradient-primary">tecnología y expertise</span> de primer nivel
            </h2>
            
            <div className="row g-4 mb-5">
              {['fa-microchip', 'fa-tractor', 'fa-brain'].map((icon, index) => (
                <div className="col-md-4" key={index}>
                  <div className="feature-card">
                    <i className={`fas ${icon} text-primary fa-3x mb-3`}></i>
                    <h4 className="text-white mb-2">
                      {['Software Especializado', 'Expertos en Agropecuario', 'Equipo Multidisciplinar'][index]}
                    </h4>
                    <p className="text-light mb-0">
                      {['Tecnología de última generación', 'Sector específico especializado', 'Profesionales certificados'][index]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4 stats-grid">
              {[3500, 2300, 200, 2500].map((number, index) => (
                <div className="col-md-3" key={index}>
                  <div className="stat-card">
                    <h3 className="text-gradient-primary display-4 mb-2">{number.toLocaleString()}+</h3>
                    <div className="divider-line bg-primary"></div>
                    <p className="text-uppercase text-light mb-0">
                      {['Empresas Asesoradas', 'Devoluciones de IVA', 'Actividades Económicas', 'Conferencias Impartidas'][index]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;