import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const NoticiasAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [nuevaNoticia, setNuevaNoticia] = useState({
    titulo: '',
    contenido: '',
    fecha: '',
    imagen: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para guardar en API
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Administración de Noticias</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nueva Noticia
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Noticia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control 
                type="text" 
                required
                value={nuevaNoticia.titulo}
                onChange={(e) => setNuevaNoticia({...nuevaNoticia, titulo: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                required
                value={nuevaNoticia.contenido}
                onChange={(e) => setNuevaNoticia({...nuevaNoticia, contenido: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control 
                type="date" 
                required
                value={nuevaNoticia.fecha}
                onChange={(e) => setNuevaNoticia({...nuevaNoticia, fecha: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control 
                type="url" 
                required
                value={nuevaNoticia.imagen}
                onChange={(e) => setNuevaNoticia({...nuevaNoticia, imagen: e.target.value})}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar Noticia
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Listado de noticias para editar */}
      <div className="list-group">
        {/* Mapear noticias existentes con opción de editar/eliminar */}
      </div>
    </div>
  );
};

export default NoticiasAdmin;