import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Eye, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface StaticPage {
  id: string;
  page_type: string;
  title: string;
  content: string;
  updated_at: string;
}

export default function PageEditor() {
  const { pageType } = useParams<{ pageType: string }>();
  const [page, setPage] = useState<StaticPage | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const quillRef = useRef<ReactQuill>(null);

  const pageTypeMap: { [key: string]: string } = {
    'privacy-policy': 'privacy_policy',
    'terms-of-service': 'terms_of_service',
  };

  const pageTitleMap: { [key: string]: string } = {
    'privacy-policy': 'Política de Privacidade',
    'terms-of-service': 'Termos de Serviço',
  };

  useEffect(() => {
    if (pageType) {
      loadPage();
    }
  }, [pageType]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadPage = async () => {
    try {
      const dbPageType = pageTypeMap[pageType || ''];

      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('page_type', dbPageType)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPage(data);
        setTitle(data.title);
        setContent(data.content);
      }
    } catch (err) {
      console.error('Error loading page:', err);
      setMessage({ type: 'error', text: 'Erro ao carregar a página.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!page || !user) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('static_pages')
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq('id', page.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Conteúdo salvo com sucesso!' });
      setHasUnsavedChanges(false);

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error saving page:', err);
      setMessage({ type: 'error', text: 'Erro ao salvar. Por favor, tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('Tem alterações não salvas. Deseja realmente sair?');
      if (!confirmed) return;
    }
    navigate(`/${pageType}`);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasUnsavedChanges(true);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'link',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Cancelar</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-semibold text-gray-900">
                Editar: {pageTitleMap[pageType || '']}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {message && (
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? 'Editar' : 'Pré-visualizar'}</span>
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className="flex items-center space-x-2 bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Salvando...' : 'Salvar'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showPreview ? (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título da Página
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-2xl font-serif"
                placeholder="Digite o título..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  className="bg-white"
                  style={{ height: '500px' }}
                />
              </div>
            </div>
            <div className="mt-16 text-sm text-gray-500">
              {hasUnsavedChanges && (
                <p className="text-amber-600">Você tem alterações não salvas</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h1 className="text-4xl font-serif text-gray-900 mb-8 pb-8 border-b border-gray-200">
              {title}
            </h1>
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-gray-900
                prose-h1:text-3xl prose-h1:mb-4
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-700 prose-li:mb-2"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
