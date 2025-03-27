import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  Home,
  BookOpen,
  Clock,
  User,
  PieChart,
  MessageSquare,
  UserPlus,
  Menu,
  X
} from 'react-feather';
import Loading from '../../components/Loading/Loading';
import AdminClientes from './AdminClientes';

const Dashboard = ({ isAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeClients: 0,
    pendingTasks: 0
  });

  const recentDocuments = [
    { id: 1, name: 'Reporte Financiero Q1', type: 'pdf', date: '2024-03-01' },
    { id: 2, name: 'Contrato Servicios', type: 'docx', date: '2024-03-05' }
  ];

  const services = [
    { name: 'Asesoría Fiscal', status: 'Activo', progress: 100 },
    { name: 'Auditoría', status: 'En proceso', progress: 65 }
  ];

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockData = {
          name: isAdmin ? 'Administrador' : 'Cliente Ejemplo',
          role: isAdmin ? 'admin' : 'client',
          stats: {
            totalUsers: 142,
            activeClients: 89,
            pendingTasks: 23
          }
        };
        setUserData(mockData);
        setStats(mockData.stats);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [isAdmin]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleAdminSidebar = () => setAdminSidebarOpen(!adminSidebarOpen);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="stat-card bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-lg bg-${color}-100 mr-3`}>
          <Icon size={20} className={`text-${color}-600`} />
        </div>
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
      </div>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );

  // Sidebar principal (sin posición absoluta, se adapta al layout flex)
  const renderMainSidebar = () => (
    <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'} transition-all duration-300 shadow-xl ${sidebarOpen ? 'w-64' : 'w-20'} h-full`}>
      <div className="sidebar-header mb-6 flex items-center justify-between">
        {sidebarOpen ? (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg"></div>
            <h2 className="text-xl font-bold">{isAdmin ? 'Admin Panel' : 'Mi Espacio'}</h2>
          </div>
        ) : (
          <div className="h-8 w-8 bg-primary rounded-lg"></div>
        )}
        <button 
          onClick={toggleSidebar}
          className="text-white hover:text-primary transition-colors p-2 -mr-2"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="space-y-2">
        {[
          { to: "/dashboard", icon: Home, label: "Inicio" },
          isAdmin && { to: "/admin/usuarios", icon: User, label: "Usuarios" },
          isAdmin && { to: "/admin/clientes", icon: Users, label: "Clientes" },
          isAdmin && { to: "/admin/noticias", icon: BookOpen, label: "Noticias" },
          isAdmin && { to: "/admin/eventos", icon: Calendar, label: "Eventos" },
          { to: "/documentos", icon: FileText, label: "Documentos" },
          { to: "/mensajes", icon: MessageSquare, label: "Mensajes" },
          { to: "/configuracion", icon: Settings, label: "Configuración" },
        ].filter(Boolean).map((item, index) => (
          <Link 
            key={index}
            to={item.to}
            className="sidebar-link flex items-center p-3 hover:bg-white/10 rounded-lg group transition-all"
          >
            <item.icon size={20} className="min-w-[20px] mr-3 flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-medium truncate">{item.label}</span>
            )}
            {!sidebarOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-dark text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );

  // Panel de admin: se divide en dos columnas (contenido principal y admin-sidebar) en flex
  const renderAdminPanel = () => (
    <div className="flex flex-1 bg-gray-50 transition-all duration-300">
      {/* Contenido principal del panel */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                Hola, {userData?.name} 
              </h1>
              <p className="text-gray-500 text-sm">Resumen general del sistema</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <button className="btn-primary flex items-center justify-center px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                <Users size={16} className="mr-2" />
                Nuevo Usuario
              </button>
              <button className="btn-secondary flex items-center justify-center px-4 py-2.5 bg-dark text-white rounded-lg hover:bg-dark-600 transition-colors text-sm font-medium">
                <FileText size={16} className="mr-2" />
                Generar Reporte
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon={Users} title="Usuarios Registrados" value={stats.totalUsers} color="primary" />
            <StatCard icon={UserPlus} title="Clientes Activos" value={stats.activeClients} color="green" />
            <StatCard icon={Clock} title="Tareas Pendientes" value={stats.pendingTasks} color="yellow" />
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PieChart size={20} className="mr-2 text-green-600" />
              Distribución de Servicios
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <span className="text-gray-400 text-sm">Gráfico estadístico</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sidebar: se muestra a la derecha, en la misma altura */}
      <div className={`admin-sidebar ${adminSidebarOpen ? 'open' : 'closed'} transition-all duration-300 ${adminSidebarOpen ? 'w-80' : 'w-20'} h-full p-4 bg-white border-l border-gray-100`}>
        <div className="flex items-center justify-between mb-6">
          {adminSidebarOpen ? (
            <h3 className="text-lg font-semibold">Gestión de Clientes</h3>
          ) : (
            <div className="w-6 h-6 bg-primary rounded-full"></div>
          )}
          <button onClick={toggleAdminSidebar} className="text-gray-500 hover:text-primary p-1">
            {adminSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <div className={`overflow-hidden transition-opacity ${adminSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <AdminClientes compact={!adminSidebarOpen} />
        </div>
      </div>
    </div>
  );

  // Panel del cliente (sin admin sidebar)
  const renderClientPanel = () => (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Bienvenido de vuelta, {userData?.name}
          </h1>
          <p className="text-gray-500 text-sm">Último acceso: {new Date().toLocaleDateString()}</p>
        </div>
        {/* Contenido del cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="quick-action-card bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-primary-100 transition-all">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-primary-100 mr-3">
                <FileText size={20} className="text-primary-600" />
              </div>
              <h3 className="text-sm font-semibold">Documentos Recientes</h3>
            </div>
            <p className="text-gray-500 text-sm">2 nuevos documentos disponibles</p>
          </div>
          <div className="quick-action-card bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-green-100 transition-all">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-green-100 mr-3">
                <MessageSquare size={20} className="text-green-600" />
              </div>
              <h3 className="text-sm font-semibold">Mensajes</h3>
            </div>
            <p className="text-gray-500 text-sm">1 mensaje sin leer</p>
          </div>
          <div className="quick-action-card bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-purple-100 transition-all">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-purple-100 mr-3">
                <Settings size={20} className="text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold">Configuración</h3>
            </div>
            <p className="text-gray-500 text-sm">Personaliza tu experiencia</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText size={20} className="mr-2 text-primary-600" />
              Últimos Documentos
            </h3>
            <div className="space-y-3">
              {recentDocuments.map(doc => (
                <div key={doc.id} className="document-item flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${doc.type === 'pdf' ? 'bg-red-100' : 'bg-blue-100'} mr-3`}>
                    <FileText size={18} className={doc.type === 'pdf' ? 'text-red-600' : 'text-blue-600'} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{doc.name}</h4>
                    <p className="text-gray-500 text-xs">{new Date(doc.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings size={20} className="mr-2 text-green-600" />
              Estado de Servicios
            </h3>
            <div className="space-y-4">
              {services.map(service => (
                <div key={service.name} className="service-progress">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{service.name}</span>
                    <span className="text-gray-500 text-xs">{service.status}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${service.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    // Contenedor principal en flex para que sidebar y main-content estén al mismo nivel y con la misma altura
    <div className="dashboard-wrapper flex min-h-screen max-w-screen-lg mx-auto border border-gray-300">
      {renderMainSidebar()}
      <main className="main-content flex-1 transition-all duration-300">
        {loading ? (
          <Loading 
            fullScreen 
            message={isAdmin ? "Cargando panel..." : "Cargando tu espacio..."} 
            className="text-primary-600"
          />
        ) : (
          <>
            {isAdmin ? renderAdminPanel() : renderClientPanel()}
          </>
        )}
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  isAdmin: PropTypes.bool
};

export default Dashboard;
