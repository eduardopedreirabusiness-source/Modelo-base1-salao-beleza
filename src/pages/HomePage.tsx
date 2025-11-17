import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Booking from '../components/Booking';

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState('home');
  const [showBooking, setShowBooking] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'about', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section);
            break;
          }
        }
      }

      if (window.scrollY < 100) {
        setCurrentSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const scrollToSection = () => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 80;
          const elementPosition = element.offsetTop - offset;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
          setCurrentSection(hash);
        }
      };

      setTimeout(scrollToSection, 100);
      setTimeout(scrollToSection, 300);
      setTimeout(scrollToSection, 600);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash]);

  const handleNavigate = (section: string) => {
    if (section === 'booking') {
      setSelectedServiceId(undefined);
      setShowBooking(true);
      return;
    }

    const element = document.getElementById(section);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setCurrentSection(section);
  };

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setShowBooking(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} currentSection={currentSection} />

      <main>
        <div id="home">
          <Hero
            onBookNow={() => handleNavigate('booking')}
            onViewServices={() => handleNavigate('services')}
          />
        </div>

        <div id="services">
          <Services onBookService={handleBookService} />
        </div>

        <div id="about">
          <About />
        </div>

        <div id="testimonials">
          <Testimonials />
        </div>

        <div id="contact">
          <Contact />
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />

      {showBooking && (
        <Booking
          preselectedServiceId={selectedServiceId}
          onClose={() => {
            setShowBooking(false);
            setSelectedServiceId(undefined);
          }}
        />
      )}
    </div>
  );
}
