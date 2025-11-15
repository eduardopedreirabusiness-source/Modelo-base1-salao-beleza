import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Instagram, Facebook } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
            Entre em Contato
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tem questões? Gostaríamos de ouvir de si. Envie-nos uma mensagem e responderemos o mais breve possível.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-serif text-gray-800 mb-6">Informações de Contato</h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">Endereço</div>
                  <div className="text-gray-600">
                    Rua das Flores, nº 123<br />
                    Lisboa
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">Telefone</div>
                  <a href="tel:+351912345678" className="text-gray-600 hover:text-rose-500 transition-colors">
                    +351 912 345 678
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">Email</div>
                  <a href="mailto:contacto@belabeleza.pt" className="text-gray-600 hover:text-rose-500 transition-colors">
                    contacto@belabeleza.pt
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">Horário de Atendimento</div>
                  <div className="text-gray-600">
                    Segunda a Sexta: 9:00 - 19:00<br />
                    Sábado: 9:00 - 13:00<br />
                    Domingo: Encerrado
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="font-semibold text-gray-800 mb-4">Siga-nos</div>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>

          </div>

          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-serif text-gray-800 mb-6">Envie-nos uma Mensagem</h3>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Mensagem Enviada!</h4>
                  <p className="text-gray-600">
                    Obrigado por entrar em contato. Responderemos em breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      O Seu Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Maria Silva"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço de Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="maria@exemplo.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                      placeholder="Conte-nos mais sobre a sua questão..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-500 text-white px-6 py-4 rounded-full font-medium hover:bg-rose-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Enviar Mensagem</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
