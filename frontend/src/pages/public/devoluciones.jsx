import React from 'react';
import { Link } from 'react-router-dom';

const Devoluciones = () => {
  return (
    <div className="devoluciones-page py-6">
      {/* Hero Section */}
      <div className="devoluciones-hero bg-gradient-primary text-white py-8 mb-6">
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-4">
          <span className="text-gradient-primary">Gestión Estratégica de </span>
          <span className="text-gradient-secondary"> Devoluciones Fiscales</span>
          </h1>
          <p className="lead mb-5 text-dark">Optimiza tu flujo de efectivo y maximiza los beneficios fiscales</p>
          <div className="cta-buttons">
            <Link to="/contacto" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-hover">
              Solicitar Asesoría
            </Link>
            <Link to="/servicios" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-hover">
              Ver Servicios
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Beneficios Clave */}
        <section className="key-benefits mb-8">
          <div className="row justify-content-center mb-6">
            <div className="col-lg-10">
              <h2 className="display-5 text-center text-primary mb-6">Ventajas Competitivas</h2>
              <div className="benefits-grid row g-4">
                {[
                  {
                    icon: 'fa-coins',
                    title: 'Recuperación Rápida',
                    text: 'Procesos optimizados para devoluciones en menos de 45 días'
                  },
                  {
                    icon: 'fa-chart-line',
                    title: 'Aumento de Liquidez',
                    text: 'Hasta 35% de mejora en flujo de efectivo operativo'
                  },
                  {
                    icon: 'fa-shield-alt',
                    title: 'Cumplimiento Garantizado',
                    text: 'Gestión 100% legal y auditada por expertos'
                  },
                  {
                    icon: 'fa-clock',
                    title: 'Seguimiento Continuo',
                    text: 'Monitoreo en tiempo real de tus procesos'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="col-md-6">
                    <div className="benefit-card bg-white p-4 rounded-3 h-100 shadow-sm">
                      <i className={`fas ${benefit.icon} fa-2x text-primary mb-3`}></i>
                      <h4 className="h5 mb-3">{benefit.title}</h4>
                      <p className="text-muted mb-0">{benefit.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Casos de Éxito */}
        <section className="success-cases mb-8">
          <h2 className="display-5 text-center text-primary mb-6">Resultados Comprobados</h2>
          <div className="row g-4">
            {[
              {
                sector: 'Sector Manufacturero',
                results: {
                  eficiencia: '+25% en procesos',
                  reduccion: '-15% costos operativos',
                  optimizacion: '30% mejora en tiempos'
                }
              },
              {
                sector: 'Sector Comercial',
                results: {
                  eficiencia: '+40% en recuperaciones',
                  reduccion: '-22% en cartera vencida',
                  optimizacion: '35% aumento en liquidez'
                }
              }
            ].map((caseStudy, index) => (
              <div key={index} className="col-lg-6">
                <div className="case-card bg-white rounded-4 shadow-lg p-5">
                  <h3 className="h4 mb-4 text-primary">{caseStudy.sector}</h3>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Eficiencia: {caseStudy.results.eficiencia}
                    </li>
                    <li className="mb-3">
                      <i className="fas fa-chart-line text-info me-2"></i>
                      Reducción: {caseStudy.results.reduccion}
                    </li>
                    <li>
                      <i className="fas fa-piggy-bank text-warning me-2"></i>
                      Optimización: {caseStudy.results.optimizacion}
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Video Explicativo */}
        <section className="video-section mb-8">
          <div className="text-center mb-5">
            <h2 className="display-5 text-primary mb-4">Cómo Funciona Nuestro Proceso</h2>
            <p className="lead text-muted">Descubre nuestra metodología en 3 minutos</p>
          </div>
          <div className="video-container ratio ratio-16x9 rounded-4 shadow-lg overflow-hidden">
            <iframe 
              src="https://www.youtube.com/embed/NAe6L19PpGQ?modestbranding=1&rel=0" 
              title="Proceso de devoluciones HEZA" 
              allowFullScreen
              loading="lazy"
              className="bg-dark"
            ></iframe>
          </div>
        </section>

        {/* CTA Final */}
        <div className="cta-final bg-primary text-center text-white py-6 rounded-4 shadow">
          <h3 className="display-6 mb-4">¿Listo para Optimizar tus Devoluciones?</h3>
          <p className="mb-4">Agenda una consultoría gratuita con nuestros expertos</p>
          <Link to="/contacto" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-hover">
            Iniciar Ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Devoluciones;