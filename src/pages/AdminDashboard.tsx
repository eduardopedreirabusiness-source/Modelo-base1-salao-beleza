import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit2, Calendar, LogOut, Sparkles, Loader2, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface StaticPage {
  id: string;
  page_type: string;
  title: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .order('page_type');

      if (error) throw error;

      setPages(data || []);
    } catch (err) {
      console.error('Error loading pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPageUrl = (pageType: string) => {
    return pageType === 'privacy_policy' ? 'privacy-policy' : 'terms-of-service';
  };

  const getPageIcon = (pageType: string) => {
    return <FileText className="w-6 h-6 text-rose-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-3 rounded-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-500">StudioLux</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Ver Site
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Páginas Estáticas</h2>
          <p className="text-gray-600">Gerencie o conteúdo das páginas do site</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getPageIcon(page.page_type)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {page.page_type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Atualizado: {formatDate(page.updated_at)}</span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate(`/admin/edit/${getPageUrl(page.page_type)}`)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => navigate(`/${getPageUrl(page.page_type)}`)}
                    className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Ver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/edit/privacy-policy')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:bg-rose-50 transition-all"
            >
              <FileText className="w-5 h-5 text-rose-500" />
              <span className="text-gray-700 font-medium">Editar Política de Privacidade</span>
            </button>
            <button
              onClick={() => navigate('/admin/edit/terms-of-service')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:bg-rose-50 transition-all"
            >
              <FileText className="w-5 h-5 text-rose-500" />
              <span className="text-gray-700 font-medium">Editar Termos de Serviço</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:bg-rose-50 transition-all"
            >
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span className="text-gray-700 font-medium">Voltar ao Site</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
