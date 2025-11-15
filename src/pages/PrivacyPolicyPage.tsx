import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Loader2, Calendar, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface StaticPage {
  id: string;
  page_type: string;
  title: string;
  content: string;
  updated_at: string;
}

export default function PrivacyPolicyPage() {
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    try {
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('page_type', 'privacy_policy')
        .maybeSingle();

      if (error) throw error;

      setPage(data);
    } catch (err) {
      console.error('Error loading page:', err);
      setError('Erro ao carregar a página. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-rose-500 hover:text-rose-600 font-medium"
          >
            ← Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-rose-500 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Voltar ao Site</span>
            </button>

            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-rose-500" />
              <span className="text-xl font-serif text-gray-900">StudioLux</span>
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate('/admin/edit/privacy-policy')}
                className="flex items-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Editar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <header className="mb-8 pb-8 border-b border-gray-200">
            <h1 className="text-4xl font-serif text-gray-900 mb-4">
              {page?.title || 'Política de Privacidade'}
            </h1>
            {page?.updated_at && (
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Última atualização: {formatDate(page.updated_at)}</span>
              </div>
            )}
          </header>

          <div
            className="prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:text-gray-900
              prose-h1:text-3xl prose-h1:mb-4
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 prose-li:mb-4"
            dangerouslySetInnerHTML={{ __html: page?.content || '' }}
          />
        </article>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Se tiver alguma dúvida sobre esta política de privacidade, entre em contato conosco.
          </p>
          <button
            onClick={() => navigate('/#contact')}
            className="text-rose-500 hover:text-rose-600 font-medium transition-colors"
          >
            Ir para Contacto →
          </button>
        </div>
      </main>
    </div>
  );
}
