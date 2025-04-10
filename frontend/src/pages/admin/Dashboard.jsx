import React, { useState, useEffect } from 'react';
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
  PieChart,
  UserPlus
} from 'react-feather';
const AdminClientes = ({ recentClients = [] }) => (
  <div className="space-y-5">
    {recentClients.length > 0 ? (
      recentClients.map((client, index) => (
        <div key={client.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-primary mb-3 me-2">{client.nombre}</span>
          <span className={`section-badge ${client.activo ? 'bg-primary' : 'bg-warning'} text-white mb-4`}>
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
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeClients: 0,
    pendingTasks: 0
  });
  const [recentClients, setRecentClients] = useState([]);
  const [serviceDistribution, setServiceDistribution] = useState([]);


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        
        // Obtener datos del usuario actual
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin/login');
          return;
        }
        
        // Configurar el token para las solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        if (isAdmin) {
          try {
            // Obtener estadísticas del dashboard para administradores
            const response = await axios.get('/api/dashboard/stats?cacheBuster=' + new Date().getTime());
            
            if (response.data && response.data.stats) {
              setStats(response.data.stats);
              setRecentClients(response.data.recentClients || []);
              setServiceDistribution(response.data.serviceDistribution || []);
            }
          } catch (statsError) {
            console.error('Error al obtener estadísticas:', statsError);
            // Si falla, usar datos de respaldo
            setStats({
              totalUsers: 0,
              activeClients: 0,
              pendingTasks: 0
            });
          }
          
          try {
            // Obtener datos del usuario
            const userResponse = await axios.get('/api/auth/profile');
            if (userResponse.data && userResponse.data.user) {
              setUserData({
                name: userResponse.data.user.nombre || 'Administrador',
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
            // Obtener estadísticas del dashboard para clientes
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
            // Si falla, usar datos de respaldo
            setStats({
              totalDocuments: 0,
              activeServices: 0,
              upcomingEvents: 0
            });
          }
          
          try {
            // Obtener datos del usuario
            const userResponse = await axios.get('/api/auth/profile');
            if (userResponse.data && userResponse.data.user) {
              setUserData({
                name: userResponse.data.user.nombre || 'Cliente',
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
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboard();
  }, [isAdmin, navigate]);

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
        <div className="mb-4">
          <span className="section-badge bg-primary-soft text-primary px-3 py-1 rounded-md">
            {isAdmin ? 'Panel Administrador' : 'Mi Espacio'}
          </span>
        </div>
        
        <div className="space-y-2">
          {[
            { to: "/dashboard", icon: Home, label: "Inicio" },
            ...(isAdmin ? [
              { to: "/admin/usuarios", icon: User, label: "Usuarios" },
              { to: "/admin/clientes", icon: Users, label: "Clientes" },
              { to: "/admin/noticias", icon: BookOpen, label: "Noticias" },
              { to: "/admin/eventos", icon: Calendar, label: "Eventos" },
            ] : []),
            { to: "/admin/documentos", icon: FileText, label: "Documentos" },
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

        {/* Buttons */}
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

      {/* Stats Cards */}
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
        <StatCard 
          icon={Clock} 
          title="Solicitudes Pendientes" 
          value={stats.pendingAccessRequests}
        />
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-primary-gradient p-3 rounded-lg mr-3">
                <BarChart className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600">Actividad Reciente</h3>
            </div>
            <AdminClientes recentClients={recentClients} />
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-primary-gradient p-3 rounded-lg mr-3">
                <PieChart className="text-white w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600">Distribución de Servicios</h3>
            </div>
            <div className="space-y-4">
              {serviceDistribution?.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-600">{service.tipo}</span>
                  <div className="flex items-center">
                    <span className="text-sm bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold mr-2">
                      {service.total}
                    </span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary" 
                        style={{ width: `${(service.total / Math.max(...serviceDistribution.map(s => s.total))) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-400">
                  No hay datos disponibles
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );

  // Add this missing component
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
        {/* ... rest of client panel JSX ... */}
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