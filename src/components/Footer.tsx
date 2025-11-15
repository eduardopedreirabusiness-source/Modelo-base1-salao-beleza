import { Sparkles, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-rose-400" />
              <span className="text-2xl font-serif">StudioLux</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              O seu destino de excelência para tratamentos de beleza e cabelo de luxo. Onde a elegância encontra a excelência.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-gray-400 hover:text-rose-400 transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="text-gray-400 hover:text-rose-400 transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-gray-400 hover:text-rose-400 transition-colors"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="text-gray-400 hover:text-rose-400 transition-colors"
                >
                  Agendar Agora
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Estilo e Coloração de Cabelo</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Rua das Flores, nº 123<br />Lisboa,<br />1000-123</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <a href="tel:+351912345678" className="text-gray-400 hover:text-rose-400 transition-colors">
                  +351 912 345 678
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <a href="mailto:contacto@belabeleza.pt" className="text-gray-400 hover:text-rose-400 transition-colors">
                  contacto@belabeleza.pt
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} StudioLux. Todos os direitos reservados.
          </div>
          <div className="flex space-x-6">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="hover:text-rose-400 transition-colors"
            >
              Política de Privacidade
            </button>
            <button
              onClick={() => navigate('/terms-of-service')}
              className="hover:text-rose-400 transition-colors"
            >
              Termos de Serviço
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
