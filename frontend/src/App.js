import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';


// Componentes estáticos (siempre presentes)
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Services = lazy(() => import('./pages/public/Services'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Team = lazy(() => import('./pages/public/Team'));
const Encuesta = lazy(() => import('./pages/public/Encuesta'));


// Componentes de servicios (carga bajo demanda)
const DiagnosticoEmpresarial = lazy(() => import('./pages/public/Diagnostico_empresarial'));
const AsesoriaFiscal = lazy(() => import('./pages/public/Asesoria_fiscal'));
const Contabilidad = lazy(() => import('./pages/public/Contabilidad'));
const AsesoriaLaboralYSeguroSocial = lazy(() => import('./pages/public/Asesoria_laboral_y_seguro_social'));
const FinanzasCorporativas = lazy(() => import('./pages/public/Finanzas_Corporativas'));
const LegalCorporativo = lazy(() => import('./pages/public/Legal-Corporativo'));
const ConsultoriaYConsejosConsultivos = lazy(() => import('./pages/public/Consultoria_y_Consejos_Consultivos'));
const ProteccionPatrimonial = lazy(() => import('./pages/public/Proteccion_Patrimonial'));
const Devoluciones = lazy(() => import('./pages/public/devoluciones'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Suspense fallback={<div className="text-center py-5">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/equipo" element={<Team />} />
          {/* Rutas de Administracion*/}
          <Route path="/encuesta" element={<Encuesta />} />

          
          {/* Rutas de servicios */}
          <Route path="/servicios/diagnostico-empresarial" element={<DiagnosticoEmpresarial />} />
          <Route path="/servicios/asesoria-fiscal" element={<AsesoriaFiscal />} />
          <Route path="/servicios/contabilidad" element={<Contabilidad />} />
          <Route path="/servicios/asesoria-laboral-y-seguro-social" element={<AsesoriaLaboralYSeguroSocial />} />
          <Route path="/servicios/finanzas-corporativas" element={<FinanzasCorporativas />} />
          <Route path="/servicios/legal-corporativo" element={<LegalCorporativo />} />
          <Route path="/servicios/consultoria-y-consejos-consultivos" element={<ConsultoriaYConsejosConsultivos />} />
          <Route path="/servicios/proteccion-patrimonial" element={<ProteccionPatrimonial />} />
          <Route path="/devoluciones" element={<Devoluciones />} />
          <Route path="/servicios/diagnostico-empresarial" element={<DiagnosticoEmpresarial />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
