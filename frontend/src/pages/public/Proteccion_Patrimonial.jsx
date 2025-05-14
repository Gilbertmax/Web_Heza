import React from 'react';
import img1 from '../../assets/img/PPT.png';
import img2 from '../../assets/img/PPT.jpeg';
import { Link } from "react-router-dom";

const ProteccionPatrimonial = () => {
  

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        {/* Encabezado */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h6 className="section-badge bg-primary-soft text-primary mb-3">Protección patrimonial</h6>
            <h1 className="display-3 text-dark mb-4">
              <span className="text-gradient-primary">Protección</span>
              <span className="text-gradient-primary"> y </span> 
              <span className="text-gradient-secondary"> Sustentabilidad</span>
              <span className="text-gradient-secondary"> Empresarial</span>
            </h1>
            <p className="lead">
              Te diseñamos un plan integral que asegura la permanencia y rentabilidad de tu empresa, combinando 
              estrategias de protección patrimonial con programas de retención de talento mediante incentivos 
              fiscalmente eficientes.
            </p>
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <img 
              src={img1} 
              alt="Protección de activos" 
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-lg-6 mb-4">
            <img
              src={img2}
              alt="Planificación patrimonial"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>

        {/* Preguntas frecuentes */}
        <div className="row py-5 mb-5">
          <div className="col-lg-8 mx-auto">
            <h3 className="text-primary mb-4 text-center">
              EN HEZA TE AYUDAMOS A RESOLVER ESTAS PREGUNTAS:
            </h3>
            <div className="row g-4">
              {[
                {
                  front: "¿He analizado el riesgo de perder una persona clave de mi empresa?",
                  back: "En Heza, te ayudamos a identificar y mitigar el riesgo de perder a personas clave en tu empresa."
                },
                {
                  front: "¿Cuento con reservas para obligaciones laborales en mi empresa?",
                  back: "En Heza, te aseguramos y orientamos para que cuentes con las reservas necesarias para cubrir todas tus obligaciones laborales."
                },
                {
                  front: "¿Dispongo de una estrategia de retención de talento?",
                  back: "En Heza, diseñamos estrategias efectivas de retención para asegurar que tu talento clave se quede contigo."
                },
                {
                  front: "¿He planeado económicamente mi retiro, el de mis socios y colaboradores?",
                  back: "En Heza, te ayudamos a planificar el retiro de manera financiera para ti, tus socios y colaboradores."
                },
                {
                  front: "¿Mi empresa tiene un plan de sucesión para garantizar su continuidad?",
                  back: "En Heza, desarrollamos planes de sucesión que aseguran la continuidad y estabilidad de tu empresa a largo plazo."
                },
                {
                  front: "¿He tomado en cuenta el impacto fiscal y financiero en la sucesión de mi empresa?",
                  back: "En Heza, optimizamos el impacto fiscal y financiero en los procesos de sucesión para proteger tus activos."
                }
              ].map((card, index) => (
                <div className="col-md-6 col-lg-4" key={index}>
                  <div className='flip-container h-100'>
                    <div className="flip-card h-100">
                      <div className="flip-front d-flex align-items-center justify-content-center p-3">
                        <h5 className="mb-0 text-center">{card.front}</h5>
                      </div>
                      <div className="flip-back d-flex align-items-center justify-content-center p-3">
                        <h5 className="mb-0 text-center">{card.back}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Sección diferenciación */}
        <div className="row mb-3">
          <div className="col-12 bg-primary text-white p-3 rounded">
            <h3 className="mb-3 text-center">Nos diferenciamos</h3>
            
            <div className="row">
              {[
                "Enfoque integral en la gestión del talento y sucesión",
                "Planificación financiera personalizada y estratégica",
                "Prevención y optimización de riesgos laborales y fiscales"
              ].map((item, index) => (
                <div className="col-lg-4 mb-4 mb-lg-0" key={index}>
                  <div className="contact-card hover-lift">
                    <div className="d-flex align-items-center p-3">
                      <i className="fas fa-map-marker-alt fa-2x text-primary mr-4"></i>
                      <div>
                        <h5 className="text-white mb-2">{item}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botón CTA */}
        <div className="row mt-5">
          <div className="col-12 text-center">
           <Link to="/servicios/diagnostico-empresarial#pre-diagnostico" className="btn"> 
            <button className="btn btn-primary btn-lg px-5">
              Proteger mi patrimonio
            </button>
           </Link> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProteccionPatrimonial;