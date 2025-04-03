import React from 'react';
import finanzasImg1 from '../../assets/img/Corporativas-1.jpg';
import finanzasImg2 from '../../assets/img/Corporativas-2.jpg';

const FinanzasCorporativas = () => {
 
  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        {/* Encabezado */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h6 className="section-badge bg-primary-soft text-primary mb-3">Servicio</h6>
            <h1 className="display-3 text-dark mb-4">
              <span className="text-gradient-primary">Finanzas</span> 
              <span className="text-gradient-secondary"> Corporativas</span>
            </h1>
            <p className="lead">
              Te asesoramos para elaborar e interpretar tus estados financieros para la toma de decisiones directivas con certeza, 
              orientándote en el control financiero y administrativo, flujo de efectivo, impacto fiscal e indicadores clave.
            </p>
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <img 
              src={finanzasImg1} 
              alt="Análisis financiero" 
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-lg-6 mb-4">
            <img
              src={finanzasImg2}
              alt="Control presupuestario"
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
                  front: "¿Analizo e interpreto los estados financieros de mi empresa?",
                  back: "En Heza, optimizamos el análisis y la interpretación de tus estados financieros para una mejor toma de decisiones."
                },
                {
                  front: "¿Mis estados financieros contienen información que me facilite el proceso para la toma de decisiones?",
                  back: "En Heza, transformamos tus estados financieros en una herramienta clave para la toma de decisiones."
                },
                {
                  front: "¿Dispongo de indicadores financieros claves de la operación de mi empresa?",
                  back: "En Heza, te proporcionamos los indicadores financieros clave para impulsar la operación de tu empresa."
                },
                {
                  front: "¿Cuento con un presupuesto que me oriente en el manejo óptimo de las cuentas por cobrar y cuentas por pagar de mi empresa?",
                  back: "En Heza, te ayudamos a crear un presupuesto eficiente para gestionar tus cuentas por cobrar y pagar."
                },
                {
                  front: "¿Estoy preparado para desarrollar proyectos de inversión?",
                  back: "En Heza, te ofrecemos las herramientas necesarias para llevar a cabo proyectos de inversión con confianza."
                },
                {
                  front: "¿Cuento con el software administrativo adecuado para generar reportes, balances, estados de resultados, flujos de efectivo, informes de cuentas por pagar y por cobrar de mi empresa?",
                  back: "En Heza, te proporcionamos el software adecuado para generar reportes y gestionar la información financiera de tu empresa."
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
                "Optimización y tecnología avanzada",
                "Asesoría integral y personalizada",
                "Enfoque en la rentabilidad y el control financiero"
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
              Optimiza tus finanzas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanzasCorporativas;