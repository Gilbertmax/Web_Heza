import React from 'react';
import { Link } from 'react-router-dom';
import consultoriaImg from '../../assets/img/img-consultoria.png';


const About = () => {
  return (
    <div className="about-page">
      {/* Navegación interna */}
      <nav className="bg-light py-3">
        <div className="container">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <Link to="/nosotros#carta-director" className="nav-link">Carta del Director</Link>
            </li>
            <li className="nav-item">
              <Link to="/nosotros#MV" className="nav-link">Misión y Visión</Link>
            </li>
            <li className="nav-item">
              <Link to="/nosotros#Pilares" className="nav-link">Nuestros Pilares</Link>
            </li>
          </ul>
        </div>
      </nav>
      {/* Hero Section */}
      <section id="MV" className="hero-section py-8 bg-light-pattern mb-7">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right">
              <div className="image-wrapper position-relative">
                <img 
                  className="img-fluid rounded-lg main-image" 
                  src={consultoriaImg} 
                  alt="Equipo HEZA" 
                />
                <div className="image-border"></div>
              </div>
            </div>
            
            <div className="col-lg-6" data-aos="fade-left">
              <div className="ps-lg-4">
                <span className="section-badge bg-primary-soft text-primary mb-3">
                  Sobre nosotros
                </span>
                <h1 className="display-4 text-dark mb-4">
                  <span className="text-gradient-primary">Integridad</span>, 
                  <span className="text-gradient-secondary"> Profesionalismo</span>, 
                  <span className="text-gradient-primary"> Excelencia</span>
                </h1>
                
                <div className="directors-letter bg-white rounded-4 p-4 shadow-sm mb-5 specialty-card">
                  <div className="quote-icon text-primary mb-3">
                    <i className="fas fa-quote-left fa-2x"></i>
                  </div>
                  <p className="lead text-dark mb-0">
                    "Nuestra firma se distingue por combinar expertise técnico con compromiso social, 
                    garantizando siempre la máxima transparencia y ética profesional en cada proceso."
                  </p>
                </div>

                <div className="row g-4">
                  <div className="col-md-6 specialty-card">
                    <div className="mission-card bg-white rounded-4 p-4 shadow-hover ">
                      <i className="fas fa-bullseye fa-3x text-gradient-primary mb-3 "></i>
                      <h3 className="h4 mb-3">Misión</h3>
                      <p className="mb-0">
                        Asesorar integralmente a las PyMEs con soluciones innovadoras que generen valor sostenible.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-md-6 specialty-card">
                    <div className="vision-card bg-white rounded-4 p-4 shadow-hover">
                      <i className="fas fa-eye fa-3x text-gradient-secondary mb-3"></i>
                      <h3 className="h4 mb-3">Visión</h3>
                      <p className="mb-0">
                        Liderar la consultoría empresarial en México mediante excelencia técnica e innovación constante.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Carta del Director */}
      <section id="carta-director" className="director-letter-section py-8 bg-light mb-7">
        <div className="container">
          <div className="row justify-content-center pt-5">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <span className="section-badge bg-primary-soft text-primary mb-3">
                  Mensaje de Dirección
                </span>
                <h2 className="display-5 text-dark">Carta del Director</h2>
                <div className="divider-center my-4">
                  <span className="divider-line bg-primary"></span>
                </div>
              </div>
              
              <div className="director-letter bg-white rounded-4 p-5 shadow">
                <div className="letter-content">
                  <p className="lead mb-4">
                    Nuestra empresa es reconocida por su integridad, confiabilidad y conducta ética.
                  </p>
                  
                  <p className="mb-4">
                    Los servicios que ofrecemos son de alta calidad y calidez, dignos de confianza porque están 
                    sustentados en valores corporativos como son Integridad, Responsabilidad y Conducta ética.
                  </p>
                  
                  <p className="mb-4">
                    Actuar con integridad es proteger la imagen, reputación y congruencia de lo que decimos y hacemos, 
                    nos ocupamos en crear un espacio agradable de trabajo y poner el mayor esfuerzo para obtener 
                    resultados satisfactorios para nuestros clientes y colaboradores.
                  </p>
                  
                  <p className="mb-4">
                    Nuestro código de conducta empresarial es la guía que tomamos como base para el actuar diario, 
                    los lineamientos que contiene establecen las normas necesarias para hacer lo correcto y garantizar 
                    la efectividad en las operaciones que realizamos.
                  </p>
                  
                  <p className="mb-4">
                    La Asesoría en finanzas corporativas, fiscal, laboral y seguridad social se convierte en una 
                    herramienta poderosa para que nuestros clientes tomen decisiones más asertivas y hagan a sus 
                    empresas más rentables y con ello ofrezcan mejores beneficios a sus trabajadores y familias, 
                    situación que tiene mucha relevancia en el entorno social.
                  </p>
                  
                  <p className="mb-4">
                    Nuestros esfuerzos están dirigidos hacia objetivos de rentabilidad y bienestar para nuestros 
                    socios y colaboradores creando una constante capacitación con vocación hacia la innovación y 
                    desarrollo personal que les permita sentirse satisfechos de pertenecer a esta FIRMA.
                  </p>
                  
                  <p className="mb-4">
                    Como FIRMA nos diferenciamos en entregar siempre a nuestros clientes evidencia documental y 
                    electrónica del trabajo que realizamos, con ello logramos dar certeza jurídica y seguridad 
                    fiscal a ellos como socios y a sus empresas como entes jurídicos y fiscales, de igual manera 
                    los ayudamos, mediante tableros de control mensual a identificar todas aquellas actividades 
                    realizadas en sus empresas y que son importantes para que el empresario tome decisiones 
                    acertadas y con menor riesgo.
                  </p>
                  
                  <div className="director-signature text-end mt-5 ">
                    <p className="mb-1 fw-bold">Ángel Hernández</p>
                    <p className="text-muted">Director General</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores y Diferenciación */}
      <section id="Pilares" className="values-section py-8 mt-7">  
        <div className="container position-relative">
          <div className="row g-5 pt-5">  
            <div className="col-lg-4">
              <div className="values-wrapper position-relative">
                <div className="sticky-values bg-white rounded-4 p-4 shadow" style={{top: '1000px'}}>
                  <h2 className="display-6 text-primary mb-4">Nuestros Pilares Fundamentales</h2>
                  <div className="values-list">
                    {[
                      { icon: 'fa-shield-alt', title: 'Integridad', text: 'Actuamos con rectitud y transparencia' },
                      { icon: 'fa-handshake', title: 'Confiabilidad', text: 'Resultados consistentes y verificables' },
                      { icon: 'fa-graduation-cap', title: 'Expertise', text: 'Equipo en constante actualización' },
                      { icon: 'fa-heart', title: 'Compromiso Social', text: 'Impacto positivo en la comunidad' }
                    ].map((valor, index) => (
                      <div key={index} className="value-item d-flex align-items-center p-3 mb-3 rounded-3">
                        <i className={`fas ${valor.icon} fa-2x text-primary me-3`}></i>
                        <div className="specialty-card">
                        <div>
                          <h5 className="mb-1">{valor.title}</h5>
                          <small className="text-muted">{valor.text}</small>
                        </div>
                      </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="differentiation-section bg-white rounded-4 p-5 shadow">
                <h3 className="display-6 text-primary mb-4">Nuestra Ventaja Competitiva</h3>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="feature-card p-4 rounded-4 bg-light">
                      <i className="fas fa-file-certificate fa-2x text-primary mb-3"></i>
                      <h4 className="h5 mb-3">Evidencia Documental</h4>
                      <p className="mb-0">Cada proceso respaldado con documentación legal y digital</p>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="feature-card p-4 rounded-4 bg-light">
                      <i className="fas fa-chart-network fa-2x text-primary mb-3"></i>
                      <h4 className="h5 mb-3">Tableros de Control</h4>
                      <p className="mb-0">Monitoreo estratégico en tiempo real de sus operaciones</p>
                    </div>
                  </div>

                  <div className="col-12">
                  <div className="innovation-alert bg-primary-soft rounded-4 p-4 mt-4 specialty-card ">
                      <h4 className="text-primary mb-3">
                        <i className="fas fa-rocket me-2"></i>
                        Innovación Tecnológica
                      </h4>
                      <p className="mb-0">
                        Implementamos herramientas digitales de última generación para optimizar 
                        sus procesos fiscales y corporativos.
                      </p>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;