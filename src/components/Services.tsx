import { useState, useEffect } from 'react';
import { Clock, Euro, Sparkles, Scissors } from 'lucide-react';
import { supabase, Service } from '../lib/supabase';

interface ServicesProps {
  onBookService: (serviceId: string) => void;
}

type FilterType = 'all' | 'Cabelo' | 'Beleza';

export default function Services({ onBookService }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })
        .order('price', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = activeFilter === 'all'
    ? services
    : services.filter(service => service.category === activeFilter);

  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const categories = ['Cabelo', 'Beleza'];
  const orderedCategories = categories.filter(cat => groupedServices[cat]);

  const getCategoryIcon = (category: string) => {
    return category === 'Cabelo' ? Scissors : Sparkles;
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-rose-400" />
            <span className="text-rose-500 text-sm uppercase tracking-wider font-medium">
              Os Nossos Serviços
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
            Serviços Especializados
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubra a nossa gama completa de serviços de beleza profissionais.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeFilter === 'all'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Todos os Serviços
            </button>
            <button
              onClick={() => setActiveFilter('Cabelo')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeFilter === 'Cabelo'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Cabelo
            </button>
            <button
              onClick={() => setActiveFilter('Beleza')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeFilter === 'Beleza'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Beleza
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="space-y-16">
            {activeFilter === 'all' ? (
              orderedCategories.map((category) => {
                const CategoryIcon = getCategoryIcon(category);
                return (
                  <div key={category}>
                    <div className="flex items-center space-x-3 mb-8">
                      <CategoryIcon className="w-6 h-6 text-rose-500" />
                      <h3 className="text-2xl font-serif text-gray-800">{category}</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-rose-200 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {groupedServices[category].map((service) => (
                        <ServiceCard key={service.id} service={service} onBook={onBookService} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} onBook={onBookService} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Nenhum serviço disponível no momento.
          </div>
        )}
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: Service;
  onBook: (serviceId: string) => void;
}

function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img
          src={service.image_url || 'https://images.pexels.com/photos/7755257/pexels-photo-7755257.jpeg'}
          alt={service.name}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-serif text-white mb-1">{service.name}</h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2">
          {service.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4 text-rose-500" />
              <span>{service.duration} minutos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Euro className="w-4 h-4 text-rose-500" />
              <span className="text-xl font-bold text-gray-800">
                {service.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onBook(service.id)}
          className="w-full bg-rose-500 text-white py-3 rounded-full font-semibold hover:bg-rose-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
        >
          Agendar Agora
        </button>
      </div>
    </div>
  );
}
