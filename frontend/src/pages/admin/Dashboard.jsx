import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
import Loading from '../../components/Loading/Loading.jsx'; 
const AdminClientes = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-primary mb-3 me-2">Cliente Ejemplo 1</span>
      <span className="section-badge bg-primary text-white mb-4 "> Activo</span>
    </div>
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-primary mb-3 me-2">Cliente Ejemplo 2</span>
      <span className="section-badge bg-primary text-white mb-4"> Pendiente</span>
    </div>
  </div>
);

const Dashboard = ({ isAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats] = useState({
    totalUsers: 142,
    activeClients: 89,
    pendingTasks: 23
  });


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setUserData({
          name: isAdmin ? 'Administrador' : 'Cliente Ejemplo',
          role: isAdmin ? 'admin' : 'client'
        });
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [isAdmin]);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
      <div className="ffeature-card bg-white rounded-4 p-4 shadow-hover">
        <div className={`p-3 rounded-lg bg-${color}-100 mr-4`}>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-cente">
            <div className="bg-primary-gradient p-2 rounded">
            <p className="text-sm text-gray-500 font-medium">{Icon && <Icon size={24} className={`text-${color}-600`} />} {title}</p>
            </div>
          </h2>
        </div>
        <div>          
          <p className={`section-badge bg-primary text-white mb-4 text-${color}-600`}>{value}</p>
        </div>
      </div>
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
          <button className="btn btn-primary btn-lg px-2 py-2 me-4 rounded-pill shadow-hover mb-3">
            <Users size={16} className="mr-2" />
            Nuevo Usuario
          </button>
          <button className="btn btn-outline-primary btn-lg px-2 py-2 rounded-pill shadow-hover mb-3">
            <FileText size={16} className="mr-2" />
            Generar Reporte
          </button>
        </div>
      </div>

                              {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="feature-card bg-white rounded-4 p-4 shadow-hover">
           <StatCard icon={Users} title="Usuarios Registrados" value={stats.totalUsers} color=" text-white mr-2" />
        </div>
        <div className="feature-card bg-white rounded-4 p-4 shadow-hover col-12 text-center">
           <StatCard icon={UserPlus} title="Clientes Activos" value={stats.activeClients} color=" text-white mr-2" />
        </div>
        <div className="feature-card bg-white rounded-4 p-4 shadow-hover col-12 text-center">
           <StatCard icon={Clock} title="Tareas Pendientes" value={stats.pendingTasks} color=" text-white mr-2" />
        </div>    
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
        <div className="feature-card bg-white rounded-4 p-4 shadow-hover ">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-cente">
          <div className="bg-primary-gradient p-2 rounded">
               <BarChart size={25} className="text-white mr-2" />
               <span className="text-dark mt-3">Actividad Reciente</span>
          </div>
          </h2>
          <div>
           <AdminClientes />
          </div>
        </div>
        
        <div className="feature-card bg-white rounded-4 p-4 shadow-hover">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-cente">  
        <div className="bg-primary-gradient p-2 rounded">
          <PieChart size={25} className="text-white mr-2" />               
          <span className="text-dark mt-3">Distribución de Servicios</span>
        </div>
        </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <span className="text-primary mb-3 me-2">Gráfico estadístico</span>
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