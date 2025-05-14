import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const AdminClientes = () => {
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar clientes
        const clientesResponse = await axios.get('/api/admin/clientes');
        setClientes(clientesResponse.data);
        
        // Cargar solicitudes pendientes
        const solicitudesResponse = await axios.get('/api/admin/solicitudes-acceso/pendientes/count');
        setSolicitudesPendientes(solicitudesResponse.data.count);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading admin data:', error);
        setLoading(false);
        // Datos de ejemplo para desarrollo
        setClientes([
          { id: 1, nombre: 'Cliente Ejemplo 1', email: 'cliente1@ejemplo.com', empresa: 'Empresa A' },
          { id: 2, nombre: 'Cliente Ejemplo 2', email: 'cliente2@ejemplo.com', empresa: 'Empresa B' }
        ]);
        setSolicitudesPendientes(2); // Valor de ejemplo
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Clientes</h2>
        
        <Link to="/admin/Notificacion" className="btn btn-primary d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faBell} />
          Solicitudes Pendientes
          {solicitudesPendientes > 0 && (
            <span className="badge bg-danger ms-1">{solicitudesPendientes}</span>
          )}
        </Link>
      </div>
      
      {loading ? (
        <Loading type="spinner" admin={true} />
      ) : (
        <div className="card shadow">
          <div className="card-body">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Empresa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(cliente => (
                  <tr key={cliente.id}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.empresa}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">Ver</button>
                      <button className="btn btn-sm btn-outline-danger">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientes;