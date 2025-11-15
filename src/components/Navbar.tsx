import { Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export default function Navbar({ onNavigate, currentSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'services', label: 'Serviços' },
    { id: 'about', label: 'Sobre Nós' },
    { id: 'testimonials', label: 'Avaliações' },
    { id: 'contact', label: 'Contactos' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <Sparkles className="w-8 h-8 text-rose-400 group-hover:text-rose-500 transition-colors" />
            <div className="flex flex-col">
              <span className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-500 group-hover:from-rose-700 group-hover:to-pink-600 transition-all duration-300 leading-tight font-semibold">
                StudioLux
              </span>
              <span className="text-xs tracking-widest text-rose-400 font-light uppercase">
                Salão e Spa
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 ml-16">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-colors ${
                  currentSection === item.id
                    ? 'text-rose-500'
                    : 'text-gray-600 hover:text-rose-400'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('booking')}
              className="bg-rose-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-rose-600 transition-colors shadow-md hover:shadow-lg"
            >
              Agendar Agora
            </button>
          </div>

          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentSection === item.id
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('booking');
                setIsMenuOpen(false);
              }}
              className="w-full bg-rose-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-rose-600 transition-colors"
            >
              Agendar Agora
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
