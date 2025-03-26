import React, { useState } from 'react';
import { Button, Form, Modal, Card, Row, Col } from 'react-bootstrap';

const EventosAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    fecha: '',
    ubicacion: '',
    tipo: 'Próximo',
    imagen: '',
    galeria: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setEventos([...eventos, { ...nuevoEvento, id: Date.now() }]);
    setShowModal(false);
    setNuevoEvento({
      titulo: '',
      fecha: '',
      ubicacion: '',
      tipo: 'Próximo',
      imagen: '',
      galeria: []
    });
  };

  const handleDelete = (id) => {
    setEventos(eventos.filter(evento => evento.id !== id));
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Administración de Eventos</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nuevo Evento
        </Button>
      </div>

      {/* Modal para crear/editar eventos */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Gestión de Eventos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Título del Evento</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={nuevoEvento.titulo}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, titulo: e.target.value})}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={nuevoEvento.fecha}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Evento</Form.Label>
                  <Form.Select
                    value={nuevoEvento.tipo}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, tipo: e.target.value})}
                  >
                    <option value="Próximo">Próximo</option>
                    <option value="Pasado">Pasado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                required
                value={nuevoEvento.ubicacion}
                onChange={(e) => setNuevoEvento({...nuevoEvento, ubicacion: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen Principal (URL)</Form.Label>
              <Form.Control
                type="url"
                required
                value={nuevoEvento.imagen}
                onChange={(e) => setNuevoEvento({...nuevoEvento, imagen: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Galería de Imágenes (URLs separadas por comas)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={nuevoEvento.galeria.join(',')}
                onChange={(e) => setNuevoEvento({
                  ...nuevoEvento,
                  galeria: e.target.value.split(',').map(url => url.trim())
                })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar Evento
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Listado de eventos existentes */}
      <Row>
        {eventos.map(evento => (
          <Col md={4} key={evento.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={evento.imagen} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{evento.titulo}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {evento.fecha} - {evento.ubicacion}
                </Card.Subtitle>
                <Card.Text className="text-capitalize">
                  <span className={`badge ${evento.tipo === 'Próximo' ? 'bg-success' : 'bg-secondary'}`}>
                    {evento.tipo}
                  </span>
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">
                    Editar
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(evento.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EventosAdmin;