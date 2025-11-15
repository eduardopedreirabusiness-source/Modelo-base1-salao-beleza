import { useState, useEffect } from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { supabase, Testimonial } from '../lib/supabase';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('customer_name', 'Sara Costa')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-rose-400" />
            <span className="text-rose-500 text-sm uppercase tracking-wider font-medium">
              Avaliações dos Clientes
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
            O Que Dizem os Nossos Clientes
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Não acredite apenas na nossa palavra. Veja o que os nossos clientes satisfeitos têm a dizer sobre a sua experiência.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="max-w-xl w-full">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 relative"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-rose-500" />
                </div>

                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.review}"
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold text-gray-800">
                    {testimonial.customer_name}
                  </div>
                  {testimonial.service_type && (
                    <div className="text-sm text-rose-500">
                      {testimonial.service_type}
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-xl text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-yellow-50 px-6 py-3 rounded-full">
                {renderStars(5)}
                <span className="ml-2 text-2xl font-bold text-gray-800">4.9/5.0</span>
              </div>
            </div>
            <h3 className="text-2xl font-serif text-gray-800 mb-4">
              Junte-se a Milhares de Clientes Felizes
            </h3>
            <p className="text-gray-600 mb-6">
              Experimente a nossa diferença. Agende a sua consulta hoje e descubra porque os nossos clientes continuam a voltar.
            </p>
            <div className="text-sm text-gray-500">
              Baseado em mais de 500 avaliações verificadas
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
