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
  MessageSquare,
  UserPlus
} from 'react-feather';
import Loading from '../../components/Loading/Loading';

const AdminClientes = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium">Cliente Ejemplo 1</span>
      <span className="text-sm text-gray-500">Activo</span>
    </div>
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium">Cliente Ejemplo 2</span>
      <span className="text-sm text-gray-500">Pendiente</span>
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50">
      <div className="flex items-center bg-white  mb-4">
        <div className={`p-3 rounded-lg bg-${color}-300 mr-4`}>
          <Icon size={24} className={`text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
      </div>
    </div>
  );

  const renderNavbar = () => (
    <div className="container-fluid py-4 bg-light-pattern position-relative">
     <div className="row g-2">
      <div className="col-lg-3">
        <div className="pe-lg-4 sticky-intro" style={{ top: '20px', zIndex: 1 }}>
          <nav className="bg-gray-200 text-white shadow-lg fixed w-full   main-nav bg-white ">
            <div className="max-w-6xl mx-auto px-4 mb-2  flex items-center justify-between h-14  ">
             <div className="flex items-center">
              <div className="flex mb-3 justify-center">
                  <span className="section-badge bg-primary-soft text-primary px-3 py-1 rounded-md">
                    {isAdmin ? 'Panel Administrador' : 'Mi Espacio'}
                  </span>
              </div>
            
        
             <div className="hidden space-x-4 mx-auto ">
              {[
                { to: "/dashboard", icon: Home, label: "Inicio" },
                ...(isAdmin ? [
                  { to: "/admin/usuarios", icon: User, label: "Usuarios" },
                  { to: "/admin/clientes", icon: Users, label: "Clientes" },
                  { to: "/admin/noticias", icon: BookOpen, label: "Noticias" },
                  { to: "/admin/eventos", icon: Calendar, label: "Eventos" },
                ] : []),
                { to: "/documentos", icon: FileText, label: "Documentos" },
                { to: "/mensajes", icon: MessageSquare, label: "Mensajes" },
                { to: "/configuracion", icon: Settings, label: "Configuración" },
              ].filter(Boolean).map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className="flex items-center bg-white  nav-link  px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 mb-5"
                >
                  <item.icon size={18} className="mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>
           </div>
         </div>
        </nav>
       </div>
      </div>
     </div>
   </div>
  
  );
 
  const renderAdminPanel = () => (
    <div className="max-w-7xl mx-auto ">
      <div className="col-lg-8 ml-auto absolute top-0 row g-5 pt-5 display-7 text-dark mb-3 ">
      
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6 card mb-4 shadow-sm">
            <div>
            <h1 className="display-7 text-dark mb-4">
                  <span className="text-gradient-primary">Bienvenido </span>
                  <span className="text-gradient-secondary"> {userData?.name}</span>
              </h1>
              <h4 className="section-subtitle text-primary mb-4">
                  Resumen general del sistema
              </h4>
            </div>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mb-5">
            <button className="btn btn-primary btn-lg px-2 py-2 me-4 rounded-pill shadow-hover">
              <Users size={16} className="mr-2" />
              Nuevo Usuario
            </button>
            <button className="btn btn-primary btn-lg px-2 py-2  rounded-pill shadow-hover">
              <FileText size={16} className="mr-2" />
              Generar Reporte
            </button>
          </div>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ">
          <StatCard icon={Users} title="Usuarios Registrados" value={stats.totalUsers} color="primary" />
          <StatCard icon={UserPlus} title="Clientes Activos" value={stats.activeClients} color="green" />
          <StatCard icon={Clock} title="Tareas Pendientes" value={stats.pendingTasks} color="yellow" />
        </div>

      
        <div className="grid lg:grid-cols-2 gap-6 ">

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 ">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center ">
              <BarChart size={24} className="mr-2 text-primary-600  " />
              Actividad Reciente
            </h2>
            <AdminClientes />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center ">
              <PieChart size={24} className="mr-2 text-green-600" />
              Distribución de Servicios
            </h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg ">
              <span className="text-gray-400">Gráfico estadístico</span>
            </div>
           </div> 

        </div>
      </div>
    </div>     
        
  );

  const renderClientPanel = () => (
    <div className="pt-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Bienvenido, {userData?.name}</h1>
          <p className="text-gray-500">Último acceso: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium">Documentos</h3>
                <p className="text-sm text-gray-500">2 nuevos disponibles</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Mensajes</h3>
                <p className="text-sm text-gray-500">1 mensaje sin leer</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Settings size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Configuración</h3>
                <p className="text-sm text-gray-500">Personaliza tu experiencia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FileText size={24} className="mr-2 text-primary-600" />
              Últimos Documentos
            </h2>
            <div className="space-y-4">
              {recentDocuments.map(doc => (
                <div key={doc.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${doc.type === 'pdf' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <FileText size={20} className={doc.type === 'pdf' ? 'text-red-600' : 'text-blue-600'} />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-gray-500">{new Date(doc.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Settings size={24} className="mr-2 text-green-600" />
              Estado de Servicios
            </h2>
            <div className="space-y-4">
              {services.map(service => (
                <div key={service.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-gray-500">{service.status}</span>
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
    <div className="row g-2">
      {renderNavbar()}
      <main className="max-w-7xl mx-auto">
        {loading && <Loading fullScreen message={isAdmin ? "Cargando panel..." : "Cargando tu espacio..."} />}
        {!loading && isAdmin && renderAdminPanel()}
        {!loading && !isAdmin && renderClientPanel()}
      </main>
    </div>
  );  
};

Dashboard.propTypes = {
  isAdmin: PropTypes.bool
};

export default Dashboard;