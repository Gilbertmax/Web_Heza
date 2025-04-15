import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading/Loading.jsx'; 
import { 
  BarChart,
  Calendar, 
  Users, 
  FileText, 
  Settings,
  Home,
  BookOpen,
  Clock,
  User,
  UserPlus,
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
          <div className="flex flex-col">
            <span className="text-primary font-medium">{client.nombre}</span>
            <span className="text-gray-500 text-sm">{client.empresa}</span>
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

const Dashboard = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeClients: 0,
    pendingTasks: 0,
    pendingAccessRequests: 0
  });
  const [recentClients, setRecentClients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const loadDashboard = useCallback(async (isRefreshing = false) => {
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
      
      if (isAdmin) {
        try {
          const timestamp = new Date().getTime();
          const response = await axios.get(`/api/dashboard/stats?cacheBuster=${timestamp}`);
          
          if (response.data && response.data.stats) {
            setStats(response.data.stats);
            setRecentClients(response.data.recentClients || []);
          }
          
          // Obtener solicitudes de acceso pendientes
          const requestsResponse = await axios.get(`/api/dashboard/pending-requests?cacheBuster=${timestamp}`);
          if (requestsResponse.data && requestsResponse.data.pendingRequests) {
            setPendingRequests(requestsResponse.data.pendingRequests);
          }
        } catch (statsError) {
          console.error('Error al obtener estadísticas:', statsError);
          setStats({
            totalUsers: 0,
            activeClients: 0,
            pendingTasks: 0,
            pendingAccessRequests: 0
          });
        }
        
        try {
          const userResponse = await axios.get('/api/auth/profile');
          if (userResponse.data && userResponse.data.user) {
            setUserData({
              id: userResponse.data.user.id,
              name: userResponse.data.user.nombre || 'Administrador',
              email: userResponse.data.user.email,
              role: 'admin'
            });
          }
        } catch (userError) {
          console.error('Error al obtener perfil de usuario:', userError);
          setUserData({
            name: 'Administrador',
            role: 'admin'
          });
        }
      } else {
        try {
          const response = await axios.get('/api/dashboard/client-stats');
          
          if (response.data && response.data.stats) {
            setStats({
              totalDocuments: response.data.stats.totalDocuments || 0,
              activeServices: response.data.stats.activeServices || 0,
              upcomingEvents: response.data.stats.upcomingEvents || 0
            });
          }
        } catch (statsError) {
          console.error('Error al obtener estadísticas de cliente:', statsError);
          setStats({
            totalDocuments: 0,
            activeServices: 0,
            upcomingEvents: 0
          });
        }
        
        try {
          const userResponse = await axios.get('/api/auth/profile');
          if (userResponse.data && userResponse.data.user) {
            setUserData({
              id: userResponse.data.user.id,
              name: userResponse.data.user.nombre || 'Cliente',
              email: userResponse.data.user.email,
              role: 'client'
            });
          }
        } catch (userError) {
          console.error('Error al obtener perfil de cliente:', userError);
          setUserData({
            name: 'Cliente',
            role: 'client'
          });
        }
      }
    } catch (error) {
      console.error('Error al cargar el dashboard:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAdmin, navigate]);
  
  useEffect(() => {
    loadDashboard();
    
    // Actualizar datos cada 5 minutos
    const refreshInterval = setInterval(() => {
      loadDashboard(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [loadDashboard]);
  
  const handleRefresh = () => {
    loadDashboard(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };
  
  const handleViewClient = (clientId) => {
    navigate(`/admin/clientes/${clientId}`);
  };
  
  const handleApproveRequest = async (requestId) => {
    try {
      setRefreshing(true);
      await axios.post(`/api/admin/solicitudes-acceso/${requestId}/aprobar`);
      loadDashboard(true);
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleRejectRequest = async (requestId) => {
    try {
      setRefreshing(true);
      await axios.post(`/api/admin/solicitudes-acceso/${requestId}/rechazar`);
      loadDashboard(true);
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg mr-3">
          <Icon className="text-white w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      </div>
      <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        {value}
      </p>
    </div>
  );

  const renderNavbar = () => (
    <div className="bg-white shadow-sm fixed left-0 top-0 h-screen z-40" style={{ 
      width: '340px',
      paddingBottom: '100px' 
    }}>
      <nav className="p-4 h-full overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <span className="section-badge bg-primary-soft text-primary px-3 py-1 rounded-md">
            {isAdmin ? 'Panel Administrador' : 'Mi Espacio'}
          </span>
          <div className="flex items-center">
            <button 
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
              title="Actualizar datos"
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors ml-1"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {[
            { to: "/admin/dashboard", icon: Home, label: "Inicio" },
            ...(isAdmin ? [
              { to: "/admin/usuarios", icon: User, label: "Usuarios" },
              { to: "/admin/clientes", icon: Users, label: "Clientes" },
              { to: "/admin/noticias", icon: BookOpen, label: "Noticias" },
              { to: "/admin/eventos", icon: Calendar, label: "Eventos" },
            ] : []),
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

  const renderAdminPanel = () => (
    <div className="col-lg-10 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
        <div>
          <h1 className="display-7 text-dark mb-4">
            <span className="text-gradient-primary">Bienvenido </span>
            <span className="text-gradient-secondary"> {userData?.name}</span>
          </h1>
          <h4 className="mb-4">
            Resumen general del sistema
          </h4>
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <button 
            onClick={() => navigate('/admin/usuarios')} 
            className="btn btn-primary btn-lg px-2 py-2 me-4 rounded-pill shadow-hover mb-3"
          >
            <Users size={16} className="mr-2" />
            Nuevo Usuario
          </button>
          <button 
            onClick={() => navigate('/admin/clientes')} 
            className="btn btn-outline-primary btn-lg px-2 py-2 rounded-pill shadow-hover mb-3"
          >
            <FileText size={16} className="mr-2" />
            Nuevo Cliente
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={Users} 
          title="Usuarios Registrados" 
          value={stats.totalUsers}
        />
        <StatCard 
          icon={UserPlus} 
          title="Clientes Activos" 
          value={stats.activeClients}
        />

      </div>

      <div className="space-y-6">
        <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-primary-gradient p-3 rounded-lg mr-3">
                <BarChart className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600">Actividad Reciente</h3>
            </div>
            <Link to="/admin/clientes" className="text-primary hover:underline text-sm">Ver todos</Link>
          </div>
          <AdminClientes recentClients={recentClients} onViewClient={handleViewClient} />
        </div>
        
        {pendingRequests.length > 0 && (
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-warning p-3 rounded-lg mr-3">
                  <Clock className="text-white w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600">Solicitudes Pendientes</h3>
              </div>
              <span className="bg-warning text-white text-xs font-bold px-2 py-1 rounded-full">
                {pendingRequests.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{request.nombre}</h4>
                      <p className="text-sm text-gray-500">{request.empresa}</p>
                    </div>
                    <span className="bg-warning text-white text-xs px-2 py-1 rounded-full">
                      {request.tipo === 'client' ? 'Cliente' : 'Usuario'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span> {request.email}
                    </div>
                    <div>
                      <span className="text-gray-500">Teléfono:</span> {request.telefono}
                    </div>
                    {request.tipo === 'client' && (
                      <>
                        <div>
                          <span className="text-gray-500">RFC:</span> {request.rfc}
                        </div>
                        <div>
                          <span className="text-gray-500">Sucursal:</span> {request.sucursal === 'vallarta' ? 'HEZA Vallarta' : 'HEZA Guadalajara'}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleRejectRequest(request.id)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm transition-colors"
                    >
                      Rechazar
                    </button>
                    <button 
                      onClick={() => handleApproveRequest(request.id)}
                      className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-md text-sm transition-colors"
                    >
                      Aprobar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderClientPanel = () => (
    <div className="pt-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Bienvenido, {userData?.name}
          </h1>
          <p className="text-gray-500">
            Último acceso: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex">
        {renderNavbar()}
        <main style={{ 
          marginLeft: '300px',
          width: 'calc(100% - 300px)',
          padding: '2rem',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 30
        }}>
          {loading && <Loading fullScreen message={isAdmin ? "Cargando panel..." : "Cargando tu espacio..."} />}
          {!loading && isAdmin && renderAdminPanel()}
          {!loading && !isAdmin && renderClientPanel()}
        </main>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  isAdmin: PropTypes.bool
};

export default Dashboard;