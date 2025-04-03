import React from 'react';
import img1 from '../../assets/img/asefis.png';
import img2 from '../../assets/img/asesoria-fiscal-1.jpeg';

const AsesoriaFiscal = () => {
  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h6 className="section-badge bg-primary-soft text-primary mb-3">Orientacion</h6>
            <h1 className="display-3 text-dark mb-4">
              <span className="text-gradient-primary">Asesoria</span> 
              <span className="text-gradient-secondary"> Fiscal</span>
            </h1>
            <p className="lead">
              El pago de impuestos es una obligación de todo contribuyente. En HEZA te asesoramos para implementar
              herramientas que permitan cumplir con tus obligaciones fiscales, siempre apegándonos a lo permitido por las
              leyes y garantizando seguridad fiscal para tu empresa y sus socios.
            </p>
          </div>
        </div>

        <div className="row mb-5 justify-content-center">
          <div className="col-lg-6 mb-4">
            <img 
              src={img1}
              alt="Asesoría Fiscal" 
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
                  front: "¿Vigilo el correcto cumplimiento de las obligaciones fiscales de mi empresa?",
                  back: "Contamos con un sistema de control de auditorías que se alimenta automáticamente con las obligaciones fiscales de la empresa, permitiendo un seguimiento preciso y eficiente."
                },
                {
                  front: "¿Cómo afectan los impuestos en el flujo de efectivo a mi empresa?",
                  back: "En Heza reducimos riesgos, monitoreamos impuestos de manera planificada."
                },
                {
                  front: "¿Todas mis operaciones o actividades tienen materialidad?",
                  back: "En Heza, verificamos y fortalecemos la materialidad de tus operaciones para un cumplimiento fiscal sólido."
                },
                {
                  front: "¿Conozco mi nivel de riesgo fiscal y el de mi empresa?",
                  back: "En Heza, identificamos y mitigamos tu riesgo fiscal para una empresa más segura y en cumplimiento."
                },
                {
                  front: "¿Planifico a futuro el impacto financiero de los impuestos en mi empresa?",
                  back: "En Heza, te ayudamos a anticipar y gestionar el impacto fiscal para un futuro financiero sólido."
                },
                {
                  front: "¿Disponen de estrategias para mitigar el riesgo fiscal en mi empresa?",
                  back: "En Heza, diseñamos estrategias inteligentes y la medida para controlar el riesgo fiscal de tu empresa."
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

        <div className="row mb-5 justify-content-center">
          <div className="col-lg-6 mb-4">
            <img
              src={img2}
              alt="Beneficios fiscales"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 bg-primary text-white p-3 rounded">
            <h3 className="mb-3 text-center">Nos diferenciamos</h3>
            
            <div className="row">
              {[
                "Atención al cliente",
                "Manejo de Inteligencia Artificial",
                "Capacitaciones Constantes"
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
              Agenda una consulta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsesoriaFiscal;