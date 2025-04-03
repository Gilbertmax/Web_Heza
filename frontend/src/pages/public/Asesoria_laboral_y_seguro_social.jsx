import React from 'react';
import img1 from '../../assets/img/AL.jpg';
import img2 from '../../assets/img/SC.jpg';

const AsesoriaLaboralYSeguroSocial = () => {
  
  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h6 className="section-badge bg-primary-soft text-primary mb-3ext-uppercase text-primary">Orientacion</h6>
            <h1 className="display-3 text-dark mb-4">
              <span className="text-gradient-primary">Asesoría </span>
              <span className="text-gradient-secondary"> Laboral </span>
              <span className="text-gradient-secondary"> y </span>
              <span className="text-gradient-primary">Seguro </span>
              <span className="text-gradient-secondary"> Social </span>
            </h1>
            <p className="lead">
              Para asegurar el cumplimiento en tiempo y forma de las obligaciones en materia laboral y seguro social, 
              en HEZA te asesoramos estableciendo los lineamientos para la correcta integración de los expedientes laborales 
              con los requisitos que marca la ley, apoyándote en el cálculo de cuotas obrero-patronales de IMSS, INFONAVIT, 
              FONACOT, e Impuestos estatales.
            </p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <img 
              src={img1} 
              alt="Proceso laboral" 
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-lg-6 mb-4">
            <img
              src={img2}
              alt="Beneficios laborales"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>

        <div className="row py-5 mb-5">
          <div className="col-lg-8 mx-auto">
            <h3 className="text-primary mb-4 text-center">
              EN HEZA TE AYUDAMOS A RESOLVER ESTAS PREGUNTAS:
            </h3>
            <div className="row g-4">
              {[
                {
                  front: "¿Cumplo con todos los requerimientos de la ley para contratar correctamente a mis colaboradores?",
                  back: "En Heza, cumplimos con la ley en cada contratación."
                },
                {
                  front: "¿Integro adecuadamente los expedientes laborales de mis colaboradores con los requisitos que marca la ley?",
                  back: "En Heza, garantizamos la mejor asesoria para la correcta integración de los expedientes laborales"
                },
                {
                  front: "¿Cumplo con la norma 035 sobre riesgos psicosociales de mis trabajadores?",
                  back: "En Heza, te ayudamos a que cumplas con la Norma 035 para prevenir riesgos psicosociales."
                },
                {
                  front: "¿Conozco los riesgos por subcontratar trabajadores mediante outsourcing?",
                  back: "En Heza, te ayudamos a conocer y mitigar los riesgos del outsourcing."
                },
                {
                  front: "¿Calculo correcta y oportunamente el pago de cuotas obrero-patronales, tales como: INFONACOT, avisos al IMSS, INFONAVIT, secretaria de finanzas?",
                  back: "En Heza, te ayudamos a cumplir con los pagos obrero-patronales de forma precisa y a tiempo."
                },
                {
                  front: "¿Optimizo el esquema de remuneración a mis colaboradores y mis socios?",
                  back: "En Heza te asesoramos para optimizamos el esquema de remuneración para colaboradores y socios."
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


        <div className="row mb-3">
          <div className="col-12 bg-primary text-white p-3 rounded">
            <h3 className="mb-3 text-center">Nos diferenciamos</h3>
            <div className="row">
              {[
                "Soluciones tecnológicas avanzadas",
                "Asesoría personalizada",
                "Cumplimiento garantizado"
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


        
        <div className="row mt-5">
          <div className="col-12 text-center">
            <button className="btn btn-primary btn-lg px-5">
              Agendar consulta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsesoriaLaboralYSeguroSocial;