import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhoneAlt,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faTwitter, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons';
import logo from '../assets/img/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky-top ${isScrolled ? 'header-scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar bg-dark py-2 d-none d-lg-block">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="topbar-item pe-4">
                <FontAwesomeIcon icon={faEnvelope} className="text-primary me-2" />
                <a href="mailto:contacto@heza.com.mx" className="text-white small">contacto@heza.com.mx</a>
              </div>
              <div className="topbar-item">
                <FontAwesomeIcon icon={faPhoneAlt} className="text-primary me-2" />
                <a href="tel:3333305376" className="text-white small">(33) 3330-5376</a>
              </div>
            </div>
            
            <div className="d-flex social-links">
              <a href="https://www.facebook.com/hezaconsultoriaintegral" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faFacebookF} className="hover-effect" />
              </a>
              <a href="https://x.com/HEZAConsultoria" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faTwitter} className="hover-effect" />
              </a>
              <a href="https://www.youtube.com/channel/UCwFvryoTPGgpO-1CPCIgcqA" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faYoutube} className="hover-effect" />
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation */}
      <Navbar expand="lg" expanded={expanded} onToggle={setExpanded} className="main-nav bg-white">
        <Container fluid className="px-lg-4">
          <Navbar.Brand as={Link} to="/" className="logo-container">
            <img 
              src={logo} 
              alt="HEZA Consultoría" 
              className="main-logo" 
            />
          </Navbar.Brand>

          <Navbar.Toggle 
            aria-controls="main-nav" 
            className="custom-toggler"
            onClick={() => setExpanded(!expanded)}
          >
            <FontAwesomeIcon icon={expanded ? faTimes : faBars} />
          </Navbar.Toggle>

          <Navbar.Collapse id="main-nav" className="justify-content-between">
            <Nav className="mx-auto">
              {[
                { to: '/', text: 'Inicio' },
                { to: '/nosotros', text: 'Nosotros' },
                { to: '/servicios', text: 'Servicios' },
                { to: '/contacto', text: 'Contacto' },
                { to: '/noticias', text: 'Noticias' },
                { to: '/eventos', text: 'Eventos' }
              ].map((link, i) => (
                <Nav.Link 
                  key={i} 
                  as={Link} 
                  to={link.to} 
                  className="nav-link"
                  onClick={() => setExpanded(false)}
                >
                  {link.text}
                </Nav.Link>
              ))}
            </Nav>

            <div className="nav-buttons d-flex">
              <Button 
                as={Link} 
                to="/servicios/diagnostico-empresarial" 
                variant="primary" 
                className="me-3 action-btn"
                onClick={() => setExpanded(false)}
              >
                Diagnóstico
              </Button>
              <Button 
                as={Link} 
                to="/devoluciones" 
                variant="outline-primary" 
                className="action-btn"
                onClick={() => setExpanded(false)}
              >
                Devoluciones
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
                
export default Header;