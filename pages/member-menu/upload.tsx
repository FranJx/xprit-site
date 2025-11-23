import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

interface RobotFormData {
  name: string;
  battery: string;
  category: string;
  motors: string;
  yearCreated: string;
  description: string;
  images: File[];
  previewUrls: string[];
}

export default function UploadRobot() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RobotFormData>({
    name: '',
    battery: '',
    category: '',
    motors: '',
    yearCreated: new Date().getFullYear().toString(),
    description: '',
    images: [],
    previewUrls: [],
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('team_token');
    const savedUsername = localStorage.getItem('team_username');

    if (!savedToken || !savedUsername) {
      router.push('/team/login');
      return;
    }

    setToken(savedToken);
    setUsername(savedUsername);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (formData.images.length + files.length > 10) {
      setError('Máximo 10 imágenes');
      return;
    }

    // Crear previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          previewUrls: [...prev.previewUrls, event.target?.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      previewUrls: prev.previewUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!token) {
        throw new Error('No authorization token found');
      }

      // Validaciones
      if (!formData.name || !formData.category) {
        throw new Error('Por favor completa nombre y categoría');
      }

      if (formData.images.length === 0) {
        throw new Error('Por favor sube al menos una imagen');
      }

      // Crear FormData para enviar archivos
      const uploadFormData = new FormData();
      uploadFormData.append('name', formData.name);
      uploadFormData.append('battery', formData.battery);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('motors', formData.motors);
      uploadFormData.append('yearCreated', formData.yearCreated);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('submittedBy', username || '');

      formData.images.forEach((img, index) => {
        uploadFormData.append(`images`, img);
      });

      const response = await fetch('/api/robots/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al enviar el formulario');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        battery: '',
        category: '',
        motors: '',
        yearCreated: new Date().getFullYear().toString(),
        description: '',
        images: [],
        previewUrls: [],
      });

      setTimeout(() => {
        router.push('/member-menu');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('team_token');
    localStorage.removeItem('team_username');
    router.push('/team/login');
  };

  if (!token) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <>
      <Head>
        <title>Cargar Robot - XPRIT Robotics</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Cargar Robot</h1>
              <p className="text-gray-400 mt-1">Completa el formulario para enviar tu robot</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Salir
            </button>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mb-6 p-4 bg-green-900 border border-green-600 text-green-200 rounded-lg">
              ✓ Robot enviado exitosamente. Redireccionando...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-600 text-red-200 rounded-lg">
              ✕ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Nombre del Robot <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Hunter V2"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Categoría <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una categoría</option>
                <option value="hunter">Hunter</option>
                <option value="predator">Predator</option>
                <option value="seul">SEUL</option>
                <option value="thunder">Thunder</option>
                <option value="tokio">Tokio</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Dos columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Batería */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Batería (V)
                </label>
                <input
                  type="text"
                  name="battery"
                  value={formData.battery}
                  onChange={handleInputChange}
                  placeholder="Ej: 12V LiPo"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Motores */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Motores
                </label>
                <input
                  type="text"
                  name="motors"
                  value={formData.motors}
                  onChange={handleInputChange}
                  placeholder="Ej: 4x DC 1000RPM"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Año */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Año de Creación
              </label>
              <input
                type="number"
                name="yearCreated"
                value={formData.yearCreated}
                onChange={handleInputChange}
                min="2000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe tu robot: características, logros, particularidades..."
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Imágenes <span className="text-red-400">*</span> (máximo 10)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={formData.images.length >= 10}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-2xl mb-2">📷</div>
                  <p className="font-medium text-gray-200">Haz clic para subir imágenes</p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF - {formData.images.length}/10 imágenes
                  </p>
                </label>
              </div>

              {/* Preview de imágenes */}
              {formData.previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {formData.previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition ${
                loading
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Enviando...' : 'Enviar Robot'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
