import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBalanceScale, 
  faChartLine, 
  faCalculator 
} from '@fortawesome/free-solid-svg-icons';

const ServiceCard = ({ icon, title, text }) => { 
  return (
    <div className="service-card bg-white rounded-4 p-5 position-relative overflow-hidden">
      <div className="icon-gradient bg-primary-gradient">
        <FontAwesomeIcon icon={icon} className="text-white" size="2x" />
      </div>
      <h3 className="mb-3 text-dark">{title}</h3>
      <p className="text-muted mb-4">{text}</p>
      <div className="hover-layer"></div>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    { 
      icon: faBalanceScale, 
      title: "Asesoría Fiscal", 
      text: "Cumplimiento normativo y optimización de obligaciones fiscales para empresas y personas físicas." 
    },
    { 
      icon: faChartLine, 
      title: "Diagnóstico Empresarial", 
      text: "Análisis integral de la situación fiscal, financiera y operativa de su empresa." 
    },
    { 
      icon: faCalculator, 
      title: "Contabilidad", 
      text: "Servicios contables completos y actualizados según las últimas normativas fiscales." 
    }
  ];

  return (
    <div className="container-fluid py-6 bg-light-pattern position-relative">
      <div className="container py-5">
        <div className="row mb-6">
          <div className="col-12 text-center" data-aos="fade-up">
          <h1 className="display-3 text-dark mb-4">
                <span className="text-gradient-primary">Servicios</span>
                <span className="text-gradient-secondary"> Especializados</span>
          </h1>
            <h2 className="display-4 text-dark mb-3">
              Soluciones para el crecimiento de tu empresa
            </h2>
            <div className="title-divider mx-auto bg-primary"></div>
          </div>
        </div>

        <div className="row g-5">
          {services.map((service, index) => (
            <div 
              className="col-lg-4" 
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <ServiceCard 
                icon={service.icon}
                title={service.title}
                text={service.text}
              />
            </div>
          ))}
        </div>

        <div className="row mt-6">
          <div className="col-12 text-center" data-aos="fade-up">
            <Link 
              to="/servicios" 
              className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-hover"
            >
              Descubre todos nuestros servicios
              <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;