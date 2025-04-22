import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading/Loading.jsx';
import './AdminPanelLayout.css';
import {
  Calendar,
  Users,
  Settings,
  Home,
  BookOpen,
  User,
  Bell,
  RefreshCw,
  LogOut
} from 'react-feather';

const AdminClientes = ({ recentClients = [], onViewClient }) => (
  <div className="space-y-5">
    {recentClients.length > 0 ? (
      recentClients.map((client, index) => (
        <div key={client.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => onViewClient && onViewClient(client.id)}
        >
          <div className="flex flex-col overflow-hidden">
            <span className="text-primary font-medium truncate">{client.nombre}</span>
            <span className="text-gray-500 text-sm truncate">{client.empresa}</span>
          </div>
          <span className={`section-badge ${client.activo ? 'bg-primary' : 'bg-warning'} text-white`}>
            {client.activo ? 'Activo' : 'Pendiente'}
          </span>
        </div>
      ))
    ) : (
      <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
        <span className="text-gray-500">No hay clientes recientes</span>
      </div>
    )}
  </div>
);

AdminClientes.propTypes = {
  recentClients: PropTypes.array,
  onViewClient: PropTypes.func
};

const StatCard = ({ icon: Icon, title, value, className = '' }) => (
  <div className={`relative flex items-center p-5 bg-white/80 rounded-xl shadow-lg border border-gray-200 group transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 ${className}`}>
    <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary to-secondary rounded-l-xl"></div>
    <div className="flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-lg shadow-md mr-4 w-12 h-12">
      <Icon className="text-white w-6 h-6" />
    </div>
    <div className="flex-1 flex flex-col justify-center min-w-0 overflow-hidden"> 
      <span className="text-sm font-medium text-gray-500 mb-0.5 truncate">{title}</span>
      <span className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors duration-300 truncate">
        {value}
      </span>
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

const DetailItem = ({ label, value }) => (
  <>
    <dt className="col-sm-4 text-gray-color">{label}</dt>
    <dd className="col-sm-8 text-dark-color text-truncate mb-0">
      {value || <span className="text-muted">-</span>}
    </dd>
  </>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

const AdminPanelLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  const loadInitialData = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const userResponse = await axios.get('/api/auth/profile');
        if (userResponse.data && userResponse.data.user) {
          setUserData({
            id: userResponse.data.user.id,
            name: userResponse.data.user.nombre || 'Administrador',
            email: userResponse.data.user.email,
            role: 'admin'
          });
        } else {
          throw new Error('No user data found');
        }
      } catch (userError) {
        console.error('Error al obtener perfil de usuario:', userError);
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleRefresh = () => {
    window.location.reload(); 
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const renderNavbar = () => (
    <div className="bg-white shadow-sm fixed left-0 top-0 h-screen z-40">
      <nav className="p-4 h-full overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <span className="section-badge bg-primary-soft text-primary px-3 py-1 rounded-md">
            Panel Administrador
          </span>
        </div>
        
        <div className="space-y-2">
          {[
            { to: "/admin/dashboard", icon: Home, label: "Inicio" },
            { to: "/admin/usuarios", icon: User, label: "Usuarios" },
            { to: "/admin/clientes", icon: Users, label: "Clientes" },
            { to: "/admin/noticias", icon: BookOpen, label: "Noticias" },
            { to: "/admin/eventos", icon: Calendar, label: "Eventos" },
            { to: "/admin/Notificacion", icon: Bell, label: "Notificaciones" },
            { to: "/admin/configuracion", icon: Settings, label: "Configuración" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center nav-link p-3 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <item.icon size={18} className="mr-2" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );

  if (loading) {
    return <Loading fullScreen message="Cargando panel..." />;
  }

  return (
    <div className="admin-panel-layout container-fluid">
      <div className="d-flex">
        {renderNavbar()}
        <main style={{ 
          marginLeft: '0px',
          width: 'calc(100% - 280px)',
          padding: '2rem',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 30,
          backgroundColor: '#f8f9fa' 
        }}>
          <header className="bg-dark-soft rounded-3xl p-6 mb-8 shadow-lg">
            <div className="row align-items-center text-center">
              <div className="col-md-8 mb-4 mb-md-0 d-flex flex-column align-items-center justify-content-center">
                <h1 className="display-4 text-gradient-primary mb-3">
                  Bienvenido, <span className="text-primary-soft">{userData?.name || 'Administrador'}</span>
                </h1>
                <p className="lead text-gray-color mb-0">
                  Panel de control - Resumen operativo
                </p>
              </div>
              <div className="col-md-4 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex gap-3 justify-content-center">
                  <button
                    onClick={handleRefresh}
                    className="btn btn-gradient-primary btn-lg d-flex align-items-center"
                    disabled={refreshing}
                  >
                    <RefreshCw size={20} className={`me-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Actualizar
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-lg d-flex align-items-center"
                  >
                    <LogOut size={20} className="me-2" />
                    Salir
                  </button>
                </div>
              </div>
            </div>
          </header>
          <Outlet context={{ userData, refreshing, setRefreshing }} />
        </main>
      </div>
    </div>
  );
};

export { AdminClientes, StatCard, DetailItem };
export default AdminPanelLayout;