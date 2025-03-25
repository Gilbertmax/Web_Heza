import HeroCarousel from '../../components/Carousel';
import AboutSection from '../../components/About';
import ServicesSection from '../../components/Services';
import CartaDirector from '../../components/Carta_director';
import Clientes from '../../components/Clientes';

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