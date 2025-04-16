import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading/Loading.jsx'; 
import { 
  BarChart,
  Calendar, 
  Users, 
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

  // Update the StatCard component - Refined Design
  const StatCard = ({ icon: Icon, title, value }) => (
    // Card container: Adjusted background, shadow, and hover effect
    <div className="relative flex items-center p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 group transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
      {/* Vertical accent bar: Slightly thicker */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary to-secondary rounded-l-xl"></div>
      {/* Icon container: Adjusted size, shadow, and margin */}
      <div className="flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-lg shadow-md mr-4 w-12 h-12">
        <Icon className="text-white w-6 h-6" /> {/* Adjusted icon size */}
      </div>
      {/* Title and Value container */}
      <div className="flex-1 flex flex-col justify-center min-w-0"> {/* Added min-w-0 for potential truncation */}
        {/* Title: Adjusted color, size, and added truncation */}
        <span className="text-sm font-medium text-gray-500 mb-0.5 truncate">{title}</span>
        {/* Value: Adjusted size, weight, color, and added transition */}
        <span className="text-4xl font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors duration-300">
          {value}
        </span>
      </div>
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
    // Main container for the admin panel content area
    <div className="p-6 lg:p-8"> {/* Increased padding for better spacing */}
      {/* Header Section: Welcome Message & Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"> {/* Adjusted margin-bottom */}
        {/* Welcome Text */}
        <div>
          {/* Using Tailwind classes for more control over typography */}
          <h1 className="text-3xl font-bold text-gray-800 mb-1"> 
            <span className="text-gradient-primary">Bienvenido</span>
            <span className="text-gradient-secondary"> {userData?.name || 'Administrador'}</span>
          </h1>
          <p className="text-lg text-gray-500"> {/* Adjusted text size */}
            Resumen general del sistema
          </p>
        </div>
        {/* Action Buttons: Refresh & Logout - Updated Styles */}
        <div className="flex items-center space-x-3 shrink-0"> {/* Added shrink-0 to prevent wrapping issues */}
          <button 
            onClick={handleRefresh}
            // Applying btn btn-outline-primary btn-sm equivalent styles
            className="flex items-center px-3 py-1 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-200 shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Actualizar datos"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={`me-1 ${refreshing ? 'animate-spin' : ''}`} /> {/* Adjusted icon size and margin */}
            <span>Actualizar</span> {/* Optional: Add text like in Footer */}
          </button>
          <button 
            onClick={handleLogout}
            // Applying btn btn-outline-danger btn-sm equivalent styles
            className="flex items-center px-3 py-1 border border-red-500 text-red-500 rounded-md text-sm font-medium hover:bg-red-500 hover:text-white transition-colors duration-200 shadow-sm hover:shadow-lg"
            title="Cerrar sesión"
          >
            <LogOut size={16} className="me-1" /> {/* Adjusted icon size and margin */}
              <span>Salir</span> {/* Optional: Add text */}
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> {/* Adjusted gap and margin */}
        <StatCard 
          icon={Users} 
          title="Usuarios Registrados " /* Cleaned title */
          value={stats.totalUsers}
        />
        <StatCard 
          icon={UserPlus} 
          title="Clientes Activos " /* Cleaned title */
          value={stats.activeClients}
        />
      </div>
      
      {/* Main Content Sections: Recent Activity & Pending Requests */}
      <div className="space-y-8"> 
        {/* Actividad Reciente Section */}
        <div className="relative overflow-hidden p-7 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 hover:scale-[1.015] transition-transform duration-300">
          {/* Vertical accent bar */}
          <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-primary to-secondary rounded-l-2xl"></div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-xl shadow-md mr-5 w-14 h-14">
                <BarChart className="text-white w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 tracking-tight">Actividad Reciente</h3>
            </div>
            <Link 
              to="/admin/clientes" 
              className="ml-4 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow hover:bg-secondary transition-colors duration-200"
            >
              Ver todos
            </Link>
          </div>
          {/* Make sure AdminClientes component is defined or imported */}
          <AdminClientes recentClients={recentClients} onViewClient={handleViewClient} /> 
        </div>
        
        {/* Solicitudes Pendientes Section */}
        {pendingRequests.length > 0 && (
          <div className="relative overflow-hidden p-7 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 hover:scale-[1.015] transition-transform duration-300">
            {/* Vertical accent bar */}
            <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-l-2xl"></div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-md mr-5 w-14 h-14">
                  <Clock className="text-white w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 tracking-tight">Solicitudes Pendientes</h3>
              </div>
              {/* Counter Badge */}
              <span className="ml-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg font-bold shadow-sm border-2 border-white">
                {pendingRequests.length}
              </span>
            </div>
            
            {/* List of Requests */}
            <div className="space-y-5">
              {pendingRequests.map((request) => (
                // Individual Request Card (structure remains the same as previous update)
                <div key={request.id} className="bg-white/80 border border-gray-200 rounded-xl shadow-sm p-5 transition-shadow hover:shadow-md">
                  {/* Request Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-primary">{request.nombre}</h4>
                      <p className="text-sm text-gray-600">{request.empresa}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${request.tipo === 'client' ? 'bg-blue-500' : 'bg-green-500'}`}>
                      {request.tipo === 'client' ? 'Cliente' : 'Usuario'}
                    </span>
                  </div>
                  
                  {/* Request Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4 text-sm border-t border-gray-200 pt-4">
                    <div className="flex items-center">
                      <span className="text-gray-500 font-medium w-20 shrink-0">Email:</span> 
                      <span className="text-gray-700 truncate">{request.email}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 font-medium w-20 shrink-0">Teléfono:</span> 
                      <span className="text-gray-700">{request.telefono}</span>
                    </div>
                    {request.tipo === 'client' && (
                      <>
                        <div className="flex items-center">
                          <span className="text-gray-500 font-medium w-20 shrink-0">RFC:</span> 
                          <span className="text-gray-700">{request.rfc}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 font-medium w-20 shrink-0">Sucursal:</span> 
                          <span className="text-gray-700">{request.sucursal === 'vallarta' ? 'HEZA Vallarta' : 'HEZA Guadalajara'}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
                    <button 
                      onClick={() => handleRejectRequest(request.id)}
                      className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50"
                      disabled={refreshing}
                    >
                      Rechazar
                    </button>
                    <button 
                      onClick={() => handleApproveRequest(request.id)}
                      className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary text-sm font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50"
                      disabled={refreshing}
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
    </div> // End of main container
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