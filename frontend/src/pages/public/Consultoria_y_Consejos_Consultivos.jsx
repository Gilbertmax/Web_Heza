import React from 'react';
import img1 from '../../assets/img/ccc.png';
import img2 from '../../assets/img/Ccc1.jpg';

const ConsultoriaYConsejosConsultivos = () => {
  
  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h6 className="text-uppercase text-primary">Orientacion</h6>
            <h1 className="display-3 text-dark mb-4">
              <span className="text-gradient-primary">Consultoría</span>
              <span className="text-gradient-primary"> y </span> 
              <span className="text-gradient-secondary">Consejos </span>
              <span className="text-gradient-secondary"> Consultivos</span>
            </h1>
             <p className="lead">
              HEZA te brinda la oportunidad de contar con consejeros independientes expertos en diversas áreas de tu empresa, 
              mejorando la toma de decisiones de manera objetiva, con aportaciones que generen valor para convertir tu empresa 
              en una organización institucional, competitiva y sustentable.
            </p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <img 
              src={img1}
              alt="Consejo consultivo" 
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-lg-6 mb-4">
            <img
              src={img2}
              alt="Estrategia corporativa"
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
                  front: "¿Dispongo de un gobierno corporativo que institucionalice y profesionalice mi empresa?",
                  back: "En Heza, te ayudamos a institucionalizar tu empresa con un gobierno corporativo sólido y profesional."
                },
                {
                  front: "¿Cuento con la opinión de expertos independientes que me ayuden a tomar las mejores decisiones?",
                  back: "En Heza, brindamos el respaldo de expertos independientes para tomar decisiones informadas y estratégicas."
                },
                {
                  front: "¿Mi equipo me rinde cuentas adecuadamente?",
                  back: "En Heza, fomentamos la transparencia, generamos recursos para la responsabilidad en cada miembro de tu equipo."
                },
                {
                  front: "¿Desarrollo y planeo estrategias de largo plazo y alto impacto para impulsar mis áreas de administración, operaciones y comercialización?",
                  back: "En Heza, apoyamos tu visión a largo plazo con estrategias de alto impacto para cada área clave de tu empresa."
                },
                {
                  front: "¿Mi empresa tiene una estructura legal sólida para enfrentar posibles disputas o conflictos?",
                  back: "En Heza, protegemos tu empresa con una estructura legal robusta para enfrentar cualquier conflicto."
                },
                {
                  front: "¿Cuento con herramientas legales para la optimización de contratos y acuerdos comerciales?",
                  back: "En Heza, optimizamos tus contratos y acuerdos comerciales para asegurar el éxito y la seguridad legal."
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
                "Estrategia Legal Integral",
                "Protección y Cumplimiento Legal Personalizado",
                "Transparencia y Responsabilidad"
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

export default ConsultoriaYConsejosConsultivos;