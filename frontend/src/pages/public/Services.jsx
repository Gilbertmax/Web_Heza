import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStethoscope, 
  faBalanceScale, 
  faCalculator, 
  faUsersCog, 
  faCoins, 
  faComments, 
  faGavel,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  const servicios = [
    {
      id: 1,
      titulo: "Diagnóstico Empresarial",
      descripcion: "Contabilidad, fiscal, laboral, seguro social, finanzas corporativas, legal-societario, control interno y...",
      icon: faStethoscope,
      ruta: "diagnostico-empresarial"
    },
    {
      id: 2,
      titulo: "Asesoría Fiscal",
      descripcion: "Herramientas que te permitan cumplir con tus obligaciones fiscales, apegándote a lo permitido por la ley.",
      icon: faBalanceScale,
      ruta: "asesoria-fiscal"
    },
    {
      id: 3,
      titulo: "Contabilidad",
      descripcion: "Diseño de catálogo de cuentas contable de acuerdo a la actividad de tu empresa.",
      icon: faCalculator,
      ruta: "contabilidad"
    },
    {
      id: 4,
      titulo: "Asesoría Laboral y Seguro Social",
      descripcion: "Estableciendo lineamientos para la correcta integración de expedientes laborales.",
      icon: faUsersCog,
      ruta: "asesoria-laboral-y-seguro-social"
    },
    {
      id: 5,
      titulo: "Finanzas Corporativas",
      descripcion: "Control financiero y administrativo para toma de decisiones estratégicas.",
      icon: faCoins,
      ruta: "finanzas-corporativas"
    },
    {
      id: 6,
      titulo: "Legal – Corporativo",
      descripcion: "Acompañamiento para elegir el tipo de sociedad adecuado a tu actividad empresarial.",
      icon: faGavel,
      ruta: "legal-corporativo"
    },
    {
      id: 7,
      titulo: "Consultoría y Consejos Consultivos",
      descripcion: "Consejeros independientes expertos en diversas áreas de tu empresa.",
      icon: faComments,
      ruta: "consultoria-y-consejos-consultivos"
    },
    {
      id: 8,
      titulo: "Protección Patrimonial",
      descripcion: "Plan integral de protección para asegurar permanencia y rentabilidad.",
      icon: faUserShield,
      ruta: "proteccion-patrimonial"
    }
  ];

  return (
    <div className="container-fluid py-6 bg-light-pattern position-relative">
      <div className="container py-5">
        <div className="row g-5">
          {/* Sección de introducción */}
          <div className="col-lg-4">
            <div className="pe-lg-4 sticky-intro" style={{ top: '20px', zIndex: 1 }}>
              <span className="section-badge bg-primary-soft text-primary mb-3">
                Nuestra oferta
              </span>
              <h1 className="display-4 text-dark mb-4">
                <span className="text-gradient-primary">Servicios</span>
                <span className="text-gradient-secondary"> Especializados</span>
              </h1>
              <p className="lead text-muted mb-5">
                Soluciones integrales diseñadas para potenciar el crecimiento sostenible 
                de tu empresa mediante expertise técnico y estrategias innovadoras.
              </p>
              
              <div className="d-none d-lg-block">
                <div className="feature-highlight bg-primary-gradient rounded-4 p-4 text-white shadow-lg">
                  <h4 className="mb-3 text-center text-white">¿Por qué elegirnos?</h4>
                  <div className="row mb-3">
                        {[
                          "Más de 30 años de experiencia",
                          "Equipo multidisciplinario",
                          "Capacitaciones Constantes"
                        ].map((item, index) => (
                          <div className="col-lg-8 mb-8 mb-lg-1" key={index}>
                            <div className="contact-card hover-lift">
                              <div className="d-flex align-items-center p-1">
                                <i className="fas fa-map-marker-alt fa-3x text-primary mr-4"></i>
                                <div>
                                  <span className="text-white mb-1">{item}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                   </div>
                </div>
              </div> 
             </div>
          </div>

          {/* Grid de servicios */}
          <div className="col-lg-8">
            <div className="row g-4">
              {servicios.map((servicio) => (
                <div key={servicio.id} className="col-md-6" data-aos="fade-up">
                  <div className="service-card bg-white rounded-4 p-5 h-100 shadow-hover">
                    <div className="icon-wrapper bg-primary-gradient mb-4">
                      <FontAwesomeIcon icon={servicio.icon} className="fa-2x text-white" />
                    </div>
                    <h3 className="h4 text-dark mb-3">{servicio.titulo}</h3>
                    <p className="text-muted mb-4">{servicio.descripcion}</p>
                    <Link 
                      to={`/servicios/${servicio.ruta}`}
                      className="btn btn-link-primary p-0 stretched-link"
                    >
                      Ver detalles
                      <i className="fas fa-arrow-right ms-2 transition-icon"></i>
                    </Link>
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

export default Services;
