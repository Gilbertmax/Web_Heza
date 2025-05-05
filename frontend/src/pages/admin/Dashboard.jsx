import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading/Loading.jsx';
import { AdminClientes, DetailItem } from '../../components/PanelAdmin/AdminPanelLayout.jsx';
import {
  BarChart,
  Users,
  UserPlus,
  Clock,
  ArrowRight
} from 'react-feather';

const Dashboard = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const outletContext = useOutletContext();
  const {setRefreshing } = outletContext || {};
  const [stats, setStats] = useState({
    totalDocuments: 0,
    activeServices: 0,
    upcomingEvents: 0,
    totalUsers: 0,
    activeClients: 0,
    pendingTasks: 0,
    pendingAccessRequests: 0
  });
  const [recentClients, setRecentClients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const loadAdminDashboardData = useCallback(async () => {
    if (!isAdmin || !setRefreshing) return;
    try {
      setRefreshing(true);
      const timestamp = new Date().getTime();
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.get(`/api/dashboard/stats?cacheBuster=${timestamp}`);
      if (response.data && response.data.stats) {
        setStats(prevStats => ({ ...prevStats, ...response.data.stats }));
        setRecentClients(response.data.recentClients || []);
      }

      const requestsResponse = await axios.get(`/api/dashboard/pending-requests?cacheBuster=${timestamp}`);
      if (requestsResponse.data && requestsResponse.data.pendingRequests) {
        setPendingRequests(requestsResponse.data.pendingRequests);
      }
    } catch (error) {
      console.error('Error al obtener datos del dashboard admin:', error);
      setStats(prevStats => ({ ...prevStats, totalUsers: 0, activeClients: 0, pendingTasks: 0, pendingAccessRequests: 0 }));
      setRecentClients([]);
      setPendingRequests([]);
    } finally {
      if (setRefreshing) setRefreshing(false);
    }
  }, [isAdmin, navigate, setRefreshing]);

  const loadClientDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const clientToken = localStorage.getItem('clientToken');
      if (!clientToken) {
        navigate('/login');
        return;
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${clientToken}`;

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
        if (!userResponse.data || !userResponse.data.user) {
          throw new Error('No user data found');
        }
      } catch (userError) {
        console.error('Error al obtener perfil de cliente:', userError);
        localStorage.removeItem('clientToken');
        navigate('/login');
        return;
      }
    } catch (error) {
      console.error('Error al cargar el dashboard del cliente:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('clientToken');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) {
      loadClientDashboard();
    } else {
      loadAdminDashboardData();
      const refreshInterval = setInterval(() => {
        loadAdminDashboardData();
      }, 5 * 60 * 1000);
      return () => clearInterval(refreshInterval);
    }
  }, [isAdmin, loadClientDashboard, loadAdminDashboardData, navigate]);

  const handleViewClient = (clientId) => {
    navigate(`/admin/clientes/${clientId}`);
  };

  const handleApproveRequest = async (requestId) => {
    if (!setRefreshing) return;
    try {
      setRefreshing(true);
      await axios.post(`/api/admin/solicitudes-acceso/${requestId}/aprobar`);
      loadAdminDashboardData();
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
    } finally {
      if (setRefreshing) setRefreshing(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!setRefreshing) return;
    try {
      setRefreshing(true);
      await axios.post(`/api/admin/solicitudes-acceso/${requestId}/rechazar`);
      loadAdminDashboardData();
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
    } finally {
      if (setRefreshing) setRefreshing(false);
    }
  };

  
  const renderAdminPanelContent = () => (
    <div className="container-fluid px-2 mb-5 mt-4 ">
      {/* Stat Cards */}
      <section className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3 ">
          <div className="bg-white rounded-4 p-5 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center text-center transition-all hover-shadow-lg">
            <div className="d-flex align-items-center justify-content-center mb-4" style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #4e73df, #224abe)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Users size={36} color="#fff" />
            </div>
            <h5 className="text-dark mb-2">Usuarios Registrados</h5>
            <h2 className="text-primary mb-0">{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mb">
          <div className="bg-white rounded-4 p-5 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center text-center transition-all hover-shadow-lg">
            <div className="d-flex align-items-center justify-content-center mb-4" style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #858796, #5a5c69)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <UserPlus size={36} color="#fff" />
            </div>
            <h5 className="text-dark mb-2">Clientes Activos</h5>
            <h2 className="text-secondary mb-0">{stats.activeClients}</h2>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="row g-4">
        {/* Actividad Reciente */}
        <div className="col-lg-8">
          <section className="bg-white rounded-4 p-5 shadow-sm h-100 d-flex flex-column transition-all hover-shadow-lg">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div className="d-flex align-items-center">
                <div 
                  className="d-flex align-items-center justify-content-center me-3" 
                  style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #4e73df, #224abe)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                >
                  <BarChart size={26} color="#fff" />
                </div>
                <h2 className="h5 mb-0 text-dark fw-bold">Actividad Reciente</h2>
              </div>
              <Link to="/admin/clientes" className="btn btn-sm btn-primary d-flex align-items-center gap-2">
                Ver todos
                <ArrowRight size={18} />
              </Link>
            </div>

            <AdminClientes
              recentClients={recentClients}
              onViewClient={handleViewClient}
            />
          </section>
        </div>
  
        {/* Solicitudes Pendientes */}
        <div className="col-lg-4">
          {pendingRequests.length > 0 && (
            <section className="bg-white rounded-4 p-5 shadow-lg h-100 d-flex flex-column transition-all hover-shadow-lg">
              <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="d-flex align-items-center">
                  <div 
                    className="d-flex align-items-center justify-content-center me-3" 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #ffb400, #ff7f00)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  >
                    <Clock size={28} color="#fff" />
                  </div>
                  <h2 className="h6 mb-0 text-dark fw-bold">Solicitudes Pendientes</h2>
                </div>
                <span 
                  className="badge bg-warning text-dark rounded-pill py-2 px-3 fw-bold" 
                  style={{ fontSize: '1rem' }}
                >
                  {pendingRequests.length}
                </span>
              </div>

              <div className="vstack gap-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-light p-4 rounded-3xl border border-light shadow-sm hover-shadow-md transition-all">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="mb-1 text-dark">{request.nombre}</h5>
                        <small className="text-muted">{request.empresa}</small>
                      </div>
                      <span 
                        className={`badge bg-${request.tipo === 'client' ? 'primary' : 'success'} text-white rounded-pill py-2 px-3`}
                      >
                        {request.tipo === 'client' ? 'Cliente' : 'Usuario'}
                      </span>
                    </div>

                    <dl className="row small mt-3 mb-2">
                      <DetailItem label="Email" value={request.email} />
                      <DetailItem label="Teléfono" value={request.telefono} />
                      {request.tipo === 'client' && (
                        <>
                          <DetailItem label="RFC" value={request.rfc} />
                          <DetailItem label="Sucursal" value={request.sucursal === 'vallarta' ? 'HEZA Vallarta' : 'HEZA Guadalajara'} />
                        </>
                      )}
                    </dl>

                    <div className="d-flex gap-2 mt-3 justify-content-start align-items-center">
                      <button 
                        onClick={() => handleRejectRequest(request.id)} 
                        className="btn btn-outline-danger btn-sm px-3 py-2 rounded-3xl flex-shrink-0"
                      >
                        Rechazar
                      </button>
                      <button 
                        onClick={() => handleApproveRequest(request.id)} 
                        className="btn btn-primary btn-sm px-3 py-2 rounded-3xl flex-shrink-0"
                      >
                        Aprobar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
  

  if (isAdmin) {
    return renderAdminPanelContent();
  }

  if (!isAdmin) {
    return (
      <div className="container-fluid">
        {loading && <Loading fullScreen message="Cargando tu espacio..." />}
        {!loading ()}
      </div>
    );
  }

  if (!outletContext) {
    return <Loading fullScreen message="Cargando panel de administración..." />;
  }

  return renderAdminPanelContent();
};

Dashboard.propTypes = {
  isAdmin: PropTypes.bool
};

export default Dashboard;
