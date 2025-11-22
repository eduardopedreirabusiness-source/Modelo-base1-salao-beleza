import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, X, CheckCircle } from 'lucide-react';
import { supabase, Service, Booking as BookingType } from '../lib/supabase';

interface BookingProps {
  preselectedServiceId?: string;
  onClose: () => void;
}

export default function Booking({ preselectedServiceId, onClose }: BookingProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<BookingType>({
    service_id: preselectedServiceId || '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    booking_date: '',
    booking_time: '',
    notes: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (preselectedServiceId && services.length > 0) {
      setFormData({ ...formData, service_id: preselectedServiceId });
    }
  }, [services, preselectedServiceId]);

  const fetchServices = async () => {
    try {
      console.log('Booking: Fetching services from Supabase...');
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Booking: Supabase error:', error);
        throw error;
      }
      console.log('Booking: Services loaded:', data);
      setServices(data || []);
    } catch (error) {
      console.error('Booking: Failed to fetch services:', error);
      alert('Erro ao carregar serviços. Por favor, tente novamente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting booking:', formData);
      const { error } = await supabase.from('bookings').insert([formData]);

      if (error) {
        console.error('Booking error:', error);
        throw error;
      }

      console.log('Booking submitted successfully');
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to submit booking:', error);
      alert('Erro ao efetuar o agendamento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-serif text-gray-800 mb-2">Agendamento Confirmado!</h3>
          <p className="text-gray-600 mb-4">
            Obrigado por agendar connosco. Enviámos um email de confirmação para {formData.customer_email}.
          </p>
          <p className="text-sm text-gray-500">
            Entraremos em contato em breve para confirmar a sua consulta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
          <div className="relative bg-gradient-to-r from-rose-400 to-pink-400 p-8 rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-serif text-white mb-2">Agende a Sua Consulta</h2>
            <p className="text-white/90">Selecione o seu serviço e horário preferido</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span>Selecione o Serviço *</span>
              </label>
              <select
                required
                value={formData.service_id}
                onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              >
                <option value="">Escolha um serviço...</option>
                {services.reduce((acc, service) => {
                  const lastItem = acc.length > 0 ? acc[acc.length - 1] : null;
                  const lastCategory = lastItem && lastItem.type === 'category' ? lastItem.category : (lastItem && lastItem.type === 'service' ? lastItem.service.category : null);
                  if (service.category !== lastCategory) {
                    acc.push({ type: 'category' as const, category: service.category });
                  }
                  acc.push({ type: 'service' as const, service });
                  return acc;
                }, [] as Array<{ type: 'category', category: string } | { type: 'service', service: Service }>).map((item, index) => {
                  if (item.type === 'category') {
                    return (
                      <option key={`cat-${index}`} disabled className="font-bold bg-gray-100">
                        ── {item.category} ──
                      </option>
                    );
                  } else {
                    return (
                      <option key={item.service.id} value={item.service.id}>
                        {item.service.name} - €{item.service.price.toFixed(2)} ({item.service.duration} min)
                      </option>
                    );
                  }
                })}
              </select>
            </div>

            {formData.service_id && services.length > 0 && (
              <div className="bg-rose-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Serviço Selecionado:</p>
                {(() => {
                  const selectedService = services.find(s => s.id === formData.service_id);
                  return selectedService ? (
                    <>
                      <p className="text-lg font-semibold text-gray-800">{selectedService.name}</p>
                      <p className="text-sm text-gray-600">
                        €{selectedService.price.toFixed(2)} • {selectedService.duration} minutos
                      </p>
                    </>
                  ) : null;
                })()}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Nome Completo *</span>
                  </div>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="Maria Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email *</span>
                  </div>
                </label>
                <input
                  type="email"
                  required
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="maria@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Número de Telefone *</span>
                </div>
              </label>
              <input
                type="tel"
                required
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Data Preferida *</span>
                  </div>
                </label>
                <input
                  type="date"
                  required
                  min={getMinDate()}
                  value={formData.booking_date}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Horário Preferido *</span>
                  </div>
                </label>
                <select
                  required
                  value={formData.booking_time}
                  onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecione o horário...</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Notas Adicionais (Opcional)</span>
                </div>
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                placeholder="Pedidos ou preferências especiais..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-rose-500 text-white px-6 py-3 rounded-full font-medium hover:bg-rose-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Agendando...' : 'Confirmar Agendamento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
