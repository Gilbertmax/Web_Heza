import React from 'react';
import corporativoImg1 from '../../assets/img/LC.png';
import corporativoImg2 from '../../assets/img/LC1.jpg';

const LegalCorporativo = () => {
  
  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        {/* Encabezado */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h6 className="text-uppercase text-primary">Servicio & Orientacion</h6>
            <h1 className="display-3 text-dark mb-4">
              <span className="text-gradient-primary">Asesoria</span> 
              <span className="text-gradient-secondary"> Legal</span>
              <span className="text-gradient-secondary"> Corporativa</span>
            </h1>
            <p className="lead">
              En HEZA te acompañamos en la estructuración jurídica de tu empresa, desde la elección del tipo de sociedad 
              hasta el cumplimiento normativo, garantizando la protección de tus activos y relaciones comerciales.
            </p>
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="row mb-5 text-center">
          <div className="col-lg-6 mb-4  text-center">
            <img 
              src={corporativoImg1} 
              alt="Estructura corporativa" 
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
                  front: "¿Tu empresa cumple con todas las normativas legales vigentes?",
                  back: "En Heza, orientamos para el cumplimiento legal total para tu empresa."
                },
                {
                  front: "¿Proteges adecuadamente los intereses legales de tu empresa?",
                  back: "En Heza, cuidamos, orientamos y defendemos los intereses legales de tu empresa con expertos."
                },
                {
                  front: "¿Estás preparado para enfrentar cualquier desafío legal corporativo?",
                  back: "En Heza, te damos la preparación y el respaldo legal para enfrentar cualquier reto."
                },
                {
                  front: "¿Tu empresa tiene la estructura legal adecuada para su crecimiento?",
                  back: "En Heza,orientamos para que puedas diseñar la estructura legal perfecta para el crecimiento de tu empresa."
                },
                {
                  front: "¿Realizas auditorías legales para evitar riesgos innecesarios?",
                  back: "En Heza, realizamos auditorías legales para minimizar riesgos y asegurar tu tranquilidad."
                },
                {
                  front: "¿Estás protegiendo adecuadamente los contratos y acuerdos de tu empresa?",
                  back: "En Heza, orientamos a crear, diseñar y proteger cada contrato y acuerdo con respaldo legal sólido"
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



        <div className="row mb-5 text-center  text-center">
          <div className="col-lg-6 mb-4  text-center">
              <img
                src={corporativoImg2}
                alt="Documentación legal"
                className="img-fluid rounded shadow"
              />
            </div>
         </div>


        {/* Sección diferenciación */}
        <div className="row mb-3">
          <div className="col-12 bg-primary text-white p-3 rounded">
            <h3 className="mb-3 text-center">Nos diferenciamos</h3>
            
            <div className="row">
              {[
                "Asesoría integral y proactiva",
                "Soluciones personalizadas",
                "Expertos en cumplimiento y prevención de riesgos"
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
            <button className="btn btn-primary btn-lg px-5">
              Iniciar asesoría
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalCorporativo;