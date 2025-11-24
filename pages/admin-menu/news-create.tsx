import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function NewsCreate() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('noticias');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug || !content) {
      setError('Título, slug y contenido son requeridos');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('team_token');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('excerpt', excerpt);
      formData.append('content', content);
      formData.append('category', category);

      if (mainImage) {
        formData.append('mainImage', mainImage);
      }

      for (const photo of photos) {
        formData.append('photos', photo);
      }

      const res = await fetch('/api/news/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setSuccess('✓ Noticia creada exitosamente');
      setTimeout(() => {
        router.push('/admin-menu/news');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando noticia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Crear Noticia - XPRIT Robotics</title>
      </Head>

      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin-menu/news" className="text-cyan-400 hover:text-cyan-300">
              ← Volver a noticias
            </Link>
            <h1 className="text-3xl font-bold text-white mt-4">Crear Nueva Noticia</h1>
          </div>

          {/* Messages */}
          {error && <div className="mb-4 p-4 bg-red-900 text-red-200 rounded">{error}</div>}
          {success && <div className="mb-4 p-4 bg-green-900 text-green-200 rounded">{success}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white font-semibold mb-2">Título *</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                placeholder="Ej: Nuevo robot Tokio XT presentado"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-white font-semibold mb-2">Slug (URL) *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                placeholder="nuevo-robot-tokio-xt"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-white font-semibold mb-2">Extracto (resumen corto)</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white h-20"
                placeholder="Un resumen breve para vista previa..."
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-white font-semibold mb-2">Contenido (Markdown) *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white h-64 font-mono"
                placeholder="# Encabezado&#10;&#10;Contenido de la noticia en Markdown..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white font-semibold mb-2">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
              >
                <option value="noticias">Noticias</option>
                <option value="anuncio">Anuncio</option>
                <option value="logro">Logro</option>
                <option value="evento">Evento</option>
              </select>
            </div>

            {/* Main Image */}
            <div>
              <label className="block text-white font-semibold mb-2">Imagen Principal</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white file:bg-cyan-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
              />
              {mainImage && <p className="text-gray-400 text-sm mt-1">✓ {mainImage.name}</p>}
            </div>

            {/* Additional Photos */}
            <div>
              <label className="block text-white font-semibold mb-2">Fotos Adicionales (múltiples)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotosChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white file:bg-cyan-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
              />
              {photos.length > 0 && <p className="text-gray-400 text-sm mt-1">✓ {photos.length} fotos seleccionadas</p>}
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Crear Noticia'}
              </button>
              <Link href="/admin-menu/news" className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:border-gray-500">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
