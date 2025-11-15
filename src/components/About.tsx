import { useState, useEffect } from 'react';
import { Heart, Award, Users, Sparkles } from 'lucide-react';
import { supabase, TeamMember } from '../lib/supabase';

export default function About() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-6 h-6 text-rose-400" />
            <span className="text-rose-500 text-sm uppercase tracking-wider font-medium">
              Sobre Nós
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
            Onde a Beleza Encontra a Excelência
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <img
              src="https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg"
              alt="Salon Interior"
              className="rounded-2xl shadow-2xl"
            />
          </div>
          <div>
            <h3 className="text-3xl font-serif text-gray-800 mb-6">
              A Nossa História
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Fundado em 2009, o nosso salão nasceu de uma paixão por fazer com que cada cliente se sinta bonito e confiante. O que começou como um pequeno salão boutique cresceu para se tornar um destino de excelência para tratamentos de beleza de luxo.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Acreditamos que a beleza é pessoal, e cada tratamento deve ser adaptado às suas necessidades únicas. A nossa equipa de profissionais experientes dedica-se a fornecer um serviço excecional numa atmosfera acolhedora.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-rose-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">15+</div>
                <div className="text-sm text-gray-600">Anos</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-rose-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">5000+</div>
                <div className="text-sm text-gray-600">Clientes</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8 text-rose-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">12+</div>
                <div className="text-sm text-gray-600">Serviços</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-serif text-gray-800 mb-4">
            Conheça a Nossa Equipa Especializada
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Os nossos talentosos profissionais trazem anos de experiência e uma paixão pela beleza a cada consulta.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group text-center"
              >
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={member.image_url || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'}
                    alt={member.name}
                    className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="text-xl font-serif text-gray-800 mb-1">
                  {member.name}
                </h4>
                <p className="text-rose-500 text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
