import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CldUploadWidget } from 'next-cloudinary';

interface RobotFormData {
  name: string;
  slug: string;
  battery: string;
  category: string;
  motors: string;
  yearCreated: string;
  description: string;
  mainImage: string;
  photos: string[];
}

export default function TeamPanel() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RobotFormData>({
    name: '',
    slug: '',
    battery: '',
    category: '',
    motors: '',
    yearCreated: new Date().getFullYear().toString(),
    description: '',
    mainImage: '',
    photos: [],
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

  const handleLogout = () => {
    localStorage.removeItem('team_token');
    localStorage.removeItem('team_username');
    router.push('/team/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name: name,
      slug: generateSlug(name),
    }));
  };

  const handleMainImageUpload = (result: any) => {
    if (result.event === 'success') {
      setFormData(prev => ({
        ...prev,
        mainImage: result.info.secure_url,
      }));
    }
  };

  const handlePhotosUpload = (result: any) => {
    if (result.event === 'success') {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, result.info.secure_url],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
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

      // Validate required fields
      if (!formData.name || !formData.slug || !formData.category) {
        throw new Error('Por favor completa los campos requeridos (nombre, categoría)');
      }

      if (!formData.mainImage) {
        throw new Error('Por favor carga una imagen principal');
      }

      const response = await fetch('/api/robots/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          submittedBy: username,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al enviar el formulario');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        slug: '',
        battery: '',
        category: '',
        motors: '',
        yearCreated: new Date().getFullYear().toString(),
        description: '',
        mainImage: '',
        photos: [],
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <>
      <Head>
        <title>Panel de Equipo - XPRIT Robotics</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Panel de Envío</h1>
              <p className="text-gray-400 mt-1">Bienvenido, <span className="text-blue-400 font-semibold">{username}</span></p>
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
              ✓ Robot enviado exitosamente. Será revisado pronto.
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
            {/* Robot Name */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Nombre del Robot <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Ej: Hunter V2"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Slug (Auto-generated) */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Slug (Auto-generado)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                readOnly
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Se genera automáticamente del nombre</p>
            </div>

            {/* Category */}
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

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Battery */}
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

              {/* Motors */}
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

            {/* Year Created */}
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

            {/* Description */}
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

            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Imagen Principal <span className="text-red-400">*</span>
              </label>
              {formData.mainImage ? (
                <div className="relative mb-3">
                  <img
                    src={formData.mainImage}
                    alt="Imagen principal"
                    className="w-full h-48 object-cover rounded border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, mainImage: '' }))}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset="xprit_robots"
                  onSuccess={handleMainImageUpload}
                  options={{
                    folder: 'xprit_robots/submissions',
                    maxFileSize: 20971520, // 20MB
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-full border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition"
                    >
                      <div className="text-gray-300">
                        <div className="text-2xl mb-2">📷</div>
                        <p className="font-medium">Haz clic para subir imagen principal</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF hasta 20MB</p>
                      </div>
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>

            {/* Additional Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Fotos Adicionales ({formData.photos.length}/10)
              </label>
              <CldUploadWidget
                uploadPreset="xprit_robots"
                onSuccess={handlePhotosUpload}
                options={{
                  folder: 'xprit_robots/submissions',
                  maxFileSize: 20971520, // 20MB
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => formData.photos.length < 10 && open()}
                    disabled={formData.photos.length >= 10}
                    className={`w-full border-2 border-dashed rounded-lg p-6 text-center transition ${
                      formData.photos.length >= 10
                        ? 'border-gray-700 cursor-not-allowed opacity-50'
                        : 'border-gray-600 hover:border-blue-500'
                    }`}
                  >
                    <div className="text-gray-300">
                      <div className="text-2xl mb-2">🖼️</div>
                      <p className="font-medium">Haz clic para subir más fotos</p>
                      <p className="text-xs text-gray-400 mt-1">Máximo 10 fotos adicionales</p>
                    </div>
                  </button>
                )}
              </CldUploadWidget>

              {/* Photos Grid */}
              {formData.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
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

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-900 border border-blue-600 rounded-lg text-blue-200 text-sm">
            <p className="font-semibold mb-2">ℹ️ Información importante:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Los datos serán revisados y aprobados antes de ser publicados</li>
              <li>Recibirás una notificación cuando tu robot sea aprobado</li>
              <li>Las imágenes deben ser de buena calidad (mínimo 800x600px)</li>
              <li>Máximo 20MB por imagen</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
