import HeroCarousel from '../../components/Carousel';
import AboutSection from '../../components/About';
import ServicesSection from '../../components/Services';
import CartaDirector from '../../components/Carta_director';
import Clientes from '../../components/Clientes';
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Home = () => {
  return (
    <>
      <HeroCarousel />
      <AboutSection />
      <ServicesSection />
      <Clientes/>
      <CartaDirector />
    </>
  );
};

export default Home;