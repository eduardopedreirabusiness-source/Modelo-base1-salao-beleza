import { Calendar, Sparkles, Star } from 'lucide-react';

interface HeroProps {
  onBookNow: () => void;
  onViewServices: () => void;
}

export default function Hero({ onBookNow, onViewServices }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-white">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="w-8 h-8 text-rose-300" />
            <span className="text-rose-200 text-sm uppercase tracking-wider font-medium">
              Salão de Beleza Premium
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
            Transforme o Seu Visual Hoje Mesmo!
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            Experimente tratamentos de beleza luxuosos numa atmosfera serena. Onde a sua jornada de beleza começa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={onBookNow}
              className="group bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Agendar Agora</span>
            </button>
            <button
              onClick={onViewServices}
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
            >
              <Star className="w-5 h-5" />
              <span>Ver Serviços</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-xl">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">15+</div>
              <div className="text-sm text-gray-300">Anos de Experiência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">5000+</div>
              <div className="text-sm text-gray-300">Clientes Felizes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">4.9</div>
              <div className="text-sm text-gray-300">Avaliação Média</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
