import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading/Loading';

const AdminClientes = () => {
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/clientes');
        const data = await response.json();
        setClientes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading admin data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-content">
      <h2>Gestión de Clientes</h2>
      {loading ? (
        <Loading type="spinner" admin={true} />
      ) : (
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Empresa</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.empresa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminClientes;