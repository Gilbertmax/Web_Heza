import React from 'react';
import img1 from '../../assets/img/contabilidad-fiscal.jpeg';
import img2 from '../../assets/img/CF.jpg';

const Contabilidad = () => {
  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h6 className="text-uppercase text-primary">Servicio</h6>
            <h1 className="display-3 text-dark mb-4">
              <span className="text-gradient-secondary"> Contabilidad</span>
            </h1>
            <p className="lead">
              Desde 2015, el envío de contabilidad electrónica al SAT requiere especialización tanto del personal 
              como de los sistemas contables. En HEZA te acompañamos en el diseño de tu catálogo de cuentas según 
              tu actividad empresarial, implementando procesos que cumplen con las Normas de Información Financiera.
            </p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <img 
              src={img1}
              alt="Proceso contable" 
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-lg-6 mb-4">
            <img
              src={img2}
              alt="Tecnología contable"
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
                  front: "¿Cuento con un catálogo de cuentas que refleje mi actividad?",
                  back: "En Heza tendras tu catálogo de cuentas, siempre en orden"
                },
                {
                  front: "¿He implementado un proceso contable-administrativo para la elaboración de mi contabilidad que cumpla con las Normas de Información Financiera (NIF)?",
                  back: "Con heza tendras tu contabilidad alineada con las NIF."
                },
                {
                  front: "¿Reviso las cifras que envío en mi contabilidad electrónica al SAT?",
                  back: "Con heza tendras tu contabilidad electrónica, siempre verificada."
                },
                {
                  front: "¿Determino mi utilidad contable y financiera correctamente?",
                  back: "Con heza obtendras  cifras claras, para decisiones seguras."
                },
                {
                  front: "¿Utilizo mi contabilidad para el análisis y toma de decisiones directivas?",
                  back: "En heza tu contabilidad, es la clave para dirigir con precisión."
                },
                {
                  front: "¿Aprovecho las herramientas tecnológicas para la elaboración de mi contabilidad?",
                  back: "Con heza obtendras herramientas tecnológicas para una contabilidad eficiente."
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
                "Automatización Inteligente",
                "Precisión y Control en Tiempo Real",
                "Enfoque en Optimización y Análisis Estratégico"
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
              Solicitar auditoría gratuita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contabilidad;