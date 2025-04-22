import axios from 'axios';

const CMR = () => {
    const [showModal, setShowModal] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [fraseMotivacional, setFraseMotivacional] = useState('');

    useEffect(() => {
        // Obtener los clientes desde el backend
        axios.get('http://localhost:5000/api/clientes')
            .then(response => {
                setClientes(response.data); // Almacenar los datos de clientes
            })
            .catch(error => {
                console.error('Error al obtener clientes:', error);
            });
    }, []);

    // Función para exportar los clientes a Excel
    const exportarExcel = () => {
        const hoja = XLSX.utils.json_to_sheet(clientes);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Clientes");
    
        const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
        const archivo = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(archivo, "clientes.xlsx");
    };

    const handleCheckboxClick = (rfc) => {
        let actualizados = [...clientes];
        // Cambiar el estado de "es cliente" (simulación de agregar cliente)
        actualizados = actualizados.map(cliente => {
            if (cliente.rfc === rfc) {
                cliente.Pp = 'false';  // Cambiar estado de prospecto a cliente
            }
            return cliente;
        });

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
                            {clientes.map((cliente, index) => (
                                <div className="col-md-6 col-lg-4" key={index}>
                                    <div className="flip-container h-100">
                                        <div className="flip-card h-100">
                                            <div className="flip-front d-flex align-items-center justify-content-center p-3">
                                                <h5 className="mb-0 text-center">
                                                    <h5 className="mt-3 text-center form-text text-primary">{cliente.nombre}</h5>
                                                    <p className="form-text">
                                                        <strong className="form-text text-primary">RFC:</strong> {cliente.rfc}
                                                    </p>
                                                    <p className="form-text">
                                                        <strong className="form-text text-primary">Industria:</strong> {cliente.industria}
                                                    </p>
                                                    <p className="form-text">
                                                        <strong className="form-text text-primary">Contacto:</strong> {cliente.contacto}
                                                    </p>
                                                    <p className="form-text">
                                                        <strong className="form-text text-primary">Régimen Fiscal:</strong> {cliente.regimenFiscal || 'N/D'}
                                                    </p>
                                                </h5>
                                            </div>
                                            <div className="flip-back d-flex align-items-center justify-content-center p-3">
                                                <h5 className="mb-0 text-center">
                                                    <p><strong className="form-text">¿Es prospecto?</strong> {cliente.Pp === 'true' ? 'Sí' : 'No'}</p>
                                                    <p><strong className="form-text">¿Tuvo Primer Contacto?</strong> {cliente.PC === 'true' ? 'Sí' : 'No'}</p>
                                                    <p><strong className="form-text">¿Tiene Propuesta de trabajo?</strong> {cliente.Pt === 'true' ? 'Sí' : 'No'}</p>
                                                    {cliente.Pp === 'true' && (
                                                        <>
                                                            <a
                                                                href={`https://wa.me/521${cliente.numero}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="mt-3 d-flex justify-content-center"
                                                            >
                                                                <UserPlus size={32} className="icono-wsp-hover" />
                                                            </a>
                                                            {!clientes.includes(cliente.rfc) && (
                                                                <div className="form-check mt-3">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`clienteCheck-${index}`}
                                                                        checked={clientes.includes(cliente.rfc)}
                                                                        onChange={() => handleCheckboxClick(cliente.rfc)}
                                                                    /> ya es cliente?
                                                                </div>
                                                            )}
                                                            {clientes.includes(cliente.rfc) && (
                                                                <p className="text-white"> cliente </p>
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
                    <div className="col-12 bg-white rounded-4 p-3 rounded">
                        <h3 className="mb-3 text-center text-primary">Estadísticas de prospectos</h3>
                        <div className="row g-4">
                            <div className="col-lg-4 mb-4 mb-lg-0">
                                <div className="innovation-alert bg-primary-soft rounded-4 p-3 mt-4 specialty-card">
                                    <h5 className="h5 mb-2 me-4">Total de prospectos </h5>
                                    <p className="mb-2 display-6 fw-bold text-primary">{clientes.filter(cliente => cliente.Pp === 'true').length}</p>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-4 mb-lg-0">
                                <div className="innovation-alert bg-primary-soft rounded-4 p-3 mt-4 specialty-card">
                                    <h5 className="mb-2">Total prospectos registrados como clientes</h5>
                                    <p className="mb- 0 display-6 fw-bold text-primary">{clientes.filter(cliente => cliente.Pp === 'false').length}</p>
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
