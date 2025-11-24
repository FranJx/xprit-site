import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  mainImage?: string;
  photos: string[];
  category: string;
  status: string;
  author: string;
  date: string;
  publishedAt?: string;
}

export default function NewsAdmin() {
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar noticias al montar el componente
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('team_token');
      const isAdmin = localStorage.getItem('team_isAdmin');

      // Verificar autenticación
      if (!token || isAdmin !== 'true') {
        router.push('/team/login');
        return;
      }

      // Cargar todas las noticias
      try {
        const res = await fetch('/api/news/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        
        const data = await res.json();
        console.log('✓ All news loaded:', data.data);
        setNews(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando noticias');
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const handlePublish = async (newsId: string) => {
    const token = localStorage.getItem('team_token');

    try {
      const res = await fetch('/api/news/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newsId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setSuccess('✓ Noticia publicada');
      setTimeout(() => {
        setSuccess('');
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error publicando noticia');
    }
  };

  const handleDelete = async (newsId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) return;

    const token = localStorage.getItem('team_token');

    try {
      const res = await fetch('/api/news/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newsId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setSuccess('✓ Noticia eliminada');
      setTimeout(() => {
        setSuccess('');
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando noticia');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/team/login');
  };

  const draftNews = news.filter(n => n.status === 'draft');
  const publishedNews = news.filter(n => n.status === 'published');

  return (
    <>
      <Head>
        <title>Gestionar Noticias - XPRIT Robotics</title>
      </Head>

      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Gestionar Noticias</h1>
              <p className="text-gray-400 mt-2">Crea y publica noticias con imágenes</p>
            </div>
            <div className="flex gap-4">
              <Link href="/admin-menu" className="px-4 py-2 border border-gray-600 hover:border-cyan-400 text-gray-300 rounded">
                Volver
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && <div className="mb-4 p-4 bg-red-900 text-red-200 rounded">{error}</div>}
          {success && <div className="mb-4 p-4 bg-green-900 text-green-200 rounded">{success}</div>}

          {/* Create New Button */}
          <div className="mb-8">
            <Link href="/admin-menu/news-create" className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50">
              + Crear nueva noticia
            </Link>
          </div>

          {/* Loading */}
          {loading && <div className="text-center py-12 text-gray-400">Cargando...</div>}

          {/* Content */}
          {!loading && (
            <div className="space-y-8">
              {/* Draft News */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Borradores ({draftNews.length})</h2>
                {draftNews.length === 0 ? (
                  <p className="text-gray-400">Sin noticias en borrador</p>
                ) : (
                  <div className="grid gap-4">
                    {draftNews.map(n => (
                      <div key={n.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-cyan-500 transition">
                        <div className="grid md:grid-cols-4 gap-4">
                          {/* Thumbnail */}
                          <div className="h-32 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                            {n.mainImage && (
                              <Image
                                src={n.mainImage}
                                alt={n.title}
                                width={200}
                                height={128}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          
                          {/* Info */}
                          <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-cyan-300 mb-2">{n.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{n.excerpt?.substring(0, 100)}...</p>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span>Por {n.author}</span>
                              <span>•</span>
                              <span>{n.photos.length} fotos</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handlePublish(n.id)}
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                            >
                              Publicar
                            </button>
                            <button
                              onClick={() => handleDelete(n.id)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Published News */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Publicadas ({publishedNews.length})</h2>
                {publishedNews.length === 0 ? (
                  <p className="text-gray-400">Sin noticias publicadas</p>
                ) : (
                  <div className="grid gap-4">
                    {publishedNews.map(n => (
                      <div key={n.id} className="bg-gray-800 border border-cyan-600/30 rounded-lg p-6">
                        <div className="grid md:grid-cols-4 gap-4">
                          {/* Thumbnail */}
                          <div className="h-32 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                            {n.mainImage && (
                              <Image
                                src={n.mainImage}
                                alt={n.title}
                                width={200}
                                height={128}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          
                          {/* Info */}
                          <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-cyan-300 mb-2">{n.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{n.excerpt?.substring(0, 100)}...</p>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span>✓ Publicada</span>
                              <span>•</span>
                              <span>{n.photos.length} fotos</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleDelete(n.id)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
