import React, { useState, useEffect } from 'react';
import { UserPlus } from 'react-feather';
import { Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


// Aquí van todos tus prospectos...
const prospectos = [
  {
    nombre: 'Empresa Ejemplo S.A. de C.V.',
    rfc: 'EJE210506ABC',
    industria: 'Consultoría Financiera',
    contacto: 'Juan Pérez juan@empresa.com',
    numero: '3328745961',
    regimenFiscal: 'Régimen General',
    Pp: 'true',
    PC: 'true',
    Pt: 'true'
  },
  {
    nombre: 'Farmacia del Pueblo S.A. de C.V.',
    rfc: 'APE854506PAC',
    industria: 'Farmacéutica',
    contacto: 'Osvaldo Juarez osvaJu@empresa.com',
    numero: '3320165210',
    regimenFiscal: 'Régimen General',
    Pp: 'false',
    PC: 'false',
    Pt: 'false'
  },
  {
    nombre: 'Carne R.A. de C.V.',
    rfc: 'OPE854874TYC',
    industria: 'Ganadera',
    contacto: 'Moctezuma Chavez Mocte@gmail.com',
    numero: '3320165210',
    regimenFiscal: null,
    Pp: 'true',
    PC: 'false',
    Pt: 'false'
  },
  {
    nombre: 'Game Virtual Good',
    rfc: 'ERW496874TYC',
    industria: 'Desarrollo',
    contacto: 'Liam Smith Smith@empresa.com',
    numero: '5817854412',
    regimenFiscal: 'Régimen General',
    Pp: 'true',
    PC: 'true',
    Pt: 'false'
  },
  {
    nombre: 'Todo del Toro R.A.',
    rfc: 'PWE854574UY',
    industria: 'Ganadera',
    contacto: 'Rigoberto Gonzalez RiGo@empresa.com',
    numero: '3374895610',
    regimenFiscal: 'Régimen General',
    Pp: 'false',
    PC: 'false',
    Pt: 'false'
  },
  {
    nombre: 'Equipo Deportivo S.A. de C.V.',
    rfc: 'BJT210505ABC',
    industria: 'Club Deportivo',
    contacto: 'Pedro Ramos equipodec@empresa.com',
    numero: '3328634791',
    regimenFiscal: 'Régimen General',
    Pp: 'true',
    PC: 'true',
    Pt: 'false'
  }
];

const frasesMotivacionales = [
    "Cada nuevo cliente es el reflejo de su esfuerzo y dedicación. ¡Sigamos alcanzando nuevas metas juntos!",
    "Gracias a su trabajo incansable, hoy transformamos un prospecto en un cliente. ¡Esto es solo el comienzo!",
    "Cada cliente conquistado es una victoria de equipo. ¡Sigamos demostrando lo que somos capaces de hacer!",
    "Su compromiso y profesionalismo hacen posible que sigamos creciendo. ¡Este es el fruto de su esfuerzo!",
    "El éxito de cada nuevo cliente es el resultado del trabajo en equipo. ¡Vamos por muchos más!"
];

const totalProspectos = prospectos.filter(p => p.Pp === 'true').length;
const tiempoPromedioCierre = '1 días'; 

const CMR = () => {
    const [showModal, setShowModal] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [fraseMotivacional, setFraseMotivacional] = useState('');
    const exportarExcel = () => {
      const hoja = XLSX.utils.json_to_sheet(prospectos);
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, "Prospectos");
    
      const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
      const archivo = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(archivo, "prospectos.xlsx");
    };
    useEffect(() => {
      const guardados = JSON.parse(localStorage.getItem('clientes')) || [];
      setClientes(guardados);
    }, []);
  
    const handleCheckboxClick = (rfc) => {
      let actualizados;      
      setClientes(actualizados);
      localStorage.setItem('clientes', JSON.stringify(actualizados));
  
      const randomFrase = frasesMotivacionales[Math.floor(Math.random() * frasesMotivacionales.length)];
      setFraseMotivacional(randomFrase);
      setShowModal(true);
    };
  
    const handleClose = () => setShowModal(false);
  
  

  return (
    <div className="container-fluid py-5">
      <div className="container py-0">
        <div className="row py-5 mb-5">
          <div className="col-lg-8 mx-auto">
            <h3 className="text-primary mb-5 text-center">Análisis de prospectos</h3>
            <div className="row g-4">
              {prospectos.map((prospecto, index) => (
                <div className="col-md-6 col-lg-4" key={index}>
                  <div className="flip-container h-100">
                    <div className="flip-card h-100">
                      <div className="flip-front d-flex align-items-center justify-content-center p-3">
                        <h5 className="mb-0 text-center">
                          <h5 className="mt-3 text-center form-text text-primary">{prospecto.nombre}</h5>
                          <p className="form-text">
                            <strong className="form-text text-primary">RFC:</strong> {prospecto.rfc}
                          </p>
                          <p className="form-text">
                            <strong className="form-text text-primary">Industria:</strong> {prospecto.industria}
                          </p>
                          <p className="form-text">
                            <strong className="form-text text-primary">Contacto:</strong> {prospecto.contacto}
                          </p>
                          <p className="form-text">
                            <strong className="form-text text-primary">Régimen Fiscal:</strong> {prospecto.regimenFiscal || 'N/D'}
                          </p>
                        </h5>
                      </div>
                      <div className="flip-back d-flex align-items-center justify-content-center p-3">
                        <h5 className="mb-0 text-center">
                          <p><strong className="form-text">¿Es prospecto?</strong> {prospecto.Pp === 'true' ? 'Sí' : 'No'}</p>
                          <p><strong className="form-text">¿Tuvo Primer Contacto?</strong> {prospecto.PC === 'true' ? 'Sí' : 'No'}</p>
                          <p><strong className="form-text">¿Tiene Propuesta de trabajo?</strong> {prospecto.Pt === 'true' ? 'Sí' : 'No'}</p>
                          {prospecto.Pp === 'true' && (
                            <>
                              <a
                                href={`https://wa.me/521${prospecto.numero}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 d-flex justify-content-center"
                              >
                                <UserPlus size={32} className="icono-wsp-hover" />
                              </a>
                              {!clientes.includes(prospecto.rfc) && (
                                <div className="form-check mt-3">
                                    <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`clienteCheck-${index}`}
                                    checked={clientes.includes(prospecto.rfc)}
                                    onChange={() => handleCheckboxClick(prospecto.rfc)}
                                    /> ya es cliente?
                                </div>
                              )}
                              {clientes.includes(prospecto.rfc) && (
                                <p className="text-white "> cliente </p>
                              )}
                            </>
                          )}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title><span className="text-primary">🎉 ¡Felicidades Tecnologías Fiscales!</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Este prospecto ahora es un cliente.</p>
                    <p>{fraseMotivacional}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        style={{ 
                        backgroundColor: '#263D4F', 
                        borderColor: '#263D4F', 
                        borderRadius: '1.5rem' 
                        }} 
                        onClick={handleClose}
                        >Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
          </div>
        </div>

        <div className="row mb-3">
            <div className="col-12  bg-white rounded-4 p-3 rounded">
                <h3 className="mb-3 text-center text-primary">Estadísticas de prospectos</h3>
                <div className="row g-4">
                <div className="col-lg-4 mb-4 mb-lg-0 ">
                    <div className="innovation-alert bg-primary-soft rounded-4 p-3 mt-4 specialty-card">
                    <h5 className="h5 mb-2 me-4">Total de prospectos </h5>
                    <p className="mb-2 display-6 fw-bold text-primary">{totalProspectos}</p>
                    </div>
                </div>
                <div className="col-lg-4 mb-4 mb-lg-0">
                    <div className="innovation-alert bg-primary-soft rounded-4 p-3 mt-4 specialty-card">
                    <h5 className="mb-2">Total prospectos registrados como clientes</h5>
                    <p className="mb- 0 display-6 fw-bold text-primary">{clientes.length}</p>
                    </div>
                </div>
                <div className="col-lg-4 mb-4 mb-lg-0">
                    <div className="innovation-alert bg-primary-soft rounded-4 p-3 mt-4 specialty-card">
                    <h6 className="mb-2 me-4">Tiempo promedio cierre</h6>
                    <p className="mb-0 display-6 fw-bold text-primary">{tiempoPromedioCierre}</p>
                    </div>
                </div>
                </div>
                <button 
                    className="btn btn-primary btn-lg px-5"
                    style={{ backgroundColor: '#263D4F', borderColor: '#263D4F', borderRadius: '1.5rem' }}
                    onClick={exportarExcel}
                  >Exportar Datos
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CMR;
