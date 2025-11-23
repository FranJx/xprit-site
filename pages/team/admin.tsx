import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface RobotSubmission {
  id: string;
  name: string;
  slug: string;
  battery: string;
  category: string;
  motors: string;
  yearCreated: number;
  description: string;
  mainImage: string;
  photos: string[];
  status: string;
  comments: string;
  submittedBy: string;
  submittedAt: string;
}

interface ReviewState {
  robotId: string;
  action: 'approve' | 'reject';
  comments: string;
  loading: boolean;
}

export default function AdminPanel() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [robots, setRobots] = useState<RobotSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRobot, setSelectedRobot] = useState<RobotSubmission | null>(null);
  const [review, setReview] = useState<ReviewState>({
    robotId: '',
    action: 'approve',
    comments: '',
    loading: false,
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('team_token');
    const savedUsername = localStorage.getItem('team_username');

    if (!savedToken || !savedUsername) {
      router.push('/team/login');
      return;
    }

    // Only admin (fran) can access this page
    if (savedUsername !== 'fran') {
      router.push('/team/panel');
      return;
    }

    setToken(savedToken);
    setUsername(savedUsername);
    fetchPendingRobots(savedToken);
  }, [router]);

  const fetchPendingRobots = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/robots/pending', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error('Error fetching robots');

      const data = await response.json();
      setRobots(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading robots');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('team_token');
    localStorage.removeItem('team_username');
    router.push('/team/login');
  };

  const handleReviewChange = (field: string, value: string) => {
    setReview(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReviewSubmit = async () => {
    if (!selectedRobot) return;

    setReview(prev => ({ ...prev, loading: true }));
    setError('');
    setSuccess('');

    try {
      const endpoint = review.action === 'approve' 
        ? '/api/robots/approve'
        : '/api/robots/reject';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          robotId: selectedRobot.id,
          comments: review.comments,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error processing review');
      }

      setSuccess(`Robot ${review.action === 'approve' ? 'aprobado' : 'rechazado'} exitosamente`);
      setSelectedRobot(null);
      setReview({ robotId: '', action: 'approve', comments: '', loading: false });

      // Refresh list
      setTimeout(() => {
        if (token) fetchPendingRobots(token);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setReview(prev => ({ ...prev, loading: false }));
    }
  };

  const getFilteredRobots = () => {
    if (filter === 'all') return robots;
    return robots.filter(r => r.status === filter);
  };

  const filteredRobots = getFilteredRobots();

  if (!token || username !== 'fran') {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <>
      <Head>
        <title>Panel de Administración - XPRIT Robotics</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
              <p className="text-gray-400 mt-1">Revisar y aprobar envíos de robots</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Salir
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-600 text-red-200 rounded-lg">
              ✕ {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-900 border border-green-600 text-green-200 rounded-lg">
              ✓ {success}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Cargando robots...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Robots List */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Envíos ({filteredRobots.length})</h2>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          filter === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {status === 'all' && 'Todos'}
                        {status === 'pending' && 'Pendientes'}
                        {status === 'approved' && 'Aprobados'}
                        {status === 'rejected' && 'Rechazados'}
                      </button>
                    ))}
                  </div>

                  {/* Robot List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredRobots.length === 0 ? (
                      <p className="text-gray-400 text-sm">No hay robots para mostrar</p>
                    ) : (
                      filteredRobots.map(robot => (
                        <button
                          key={robot.id}
                          onClick={() => setSelectedRobot(robot)}
                          className={`w-full text-left p-3 rounded transition ${
                            selectedRobot?.id === robot.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          }`}
                        >
                          <div className="font-medium truncate">{robot.name}</div>
                          <div className="text-xs mt-1">
                            <span className={`inline-block px-2 py-0.5 rounded ${
                              robot.status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                              robot.status === 'approved' ? 'bg-green-900 text-green-200' :
                              'bg-red-900 text-red-200'
                            }`}>
                              {robot.status === 'pending' && 'Pendiente'}
                              {robot.status === 'approved' && 'Aprobado'}
                              {robot.status === 'rejected' && 'Rechazado'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Por: {robot.submittedBy}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Robot Details */}
              <div className="lg:col-span-2">
                {selectedRobot ? (
                  <div className="bg-gray-800 rounded-lg p-6">
                    {/* Main Image */}
                    <div className="mb-6">
                      <img
                        src={selectedRobot.mainImage}
                        alt={selectedRobot.name}
                        className="w-full h-64 object-cover rounded-lg border border-gray-600"
                      />
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-gray-400 text-sm">Nombre</p>
                        <p className="text-white font-semibold">{selectedRobot.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Slug</p>
                        <p className="text-white font-semibold">{selectedRobot.slug}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Categoría</p>
                        <p className="text-white font-semibold">{selectedRobot.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Año</p>
                        <p className="text-white font-semibold">{selectedRobot.yearCreated}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Batería</p>
                        <p className="text-white font-semibold">{selectedRobot.battery || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Motores</p>
                        <p className="text-white font-semibold">{selectedRobot.motors || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-400 text-sm">Enviado por</p>
                        <p className="text-white font-semibold">{selectedRobot.submittedBy}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-400 text-sm">Fecha de envío</p>
                        <p className="text-white font-semibold">
                          {new Date(selectedRobot.submittedAt).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedRobot.description && (
                      <div className="mb-6">
                        <p className="text-gray-400 text-sm mb-2">Descripción</p>
                        <p className="text-white bg-gray-700 p-3 rounded">{selectedRobot.description}</p>
                      </div>
                    )}

                    {/* Additional Photos */}
                    {selectedRobot.photos.length > 0 && (
                      <div className="mb-6">
                        <p className="text-gray-400 text-sm mb-2">Fotos Adicionales</p>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedRobot.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-24 object-cover rounded border border-gray-600 cursor-pointer hover:opacity-75 transition"
                              onClick={() => window.open(photo, '_blank')}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Review Section */}
                    {selectedRobot.status === 'pending' && (
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-white mb-4">Revisar Envío</h3>

                        {/* Action Selection */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Acción
                          </label>
                          <div className="flex gap-4">
                            {(['approve', 'reject'] as const).map(action => (
                              <label key={action} className="flex items-center">
                                <input
                                  type="radio"
                                  name="action"
                                  value={action}
                                  checked={review.action === action}
                                  onChange={(e) => handleReviewChange('action', e.target.value)}
                                  className="mr-2"
                                />
                                <span className="text-gray-200">
                                  {action === 'approve' ? '✓ Aprobar' : '✕ Rechazar'}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Comments */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Comentarios
                          </label>
                          <textarea
                            value={review.comments}
                            onChange={(e) => handleReviewChange('comments', e.target.value)}
                            placeholder="Opcional: agrega comentarios sobre la revisión"
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          onClick={handleReviewSubmit}
                          disabled={review.loading}
                          className={`w-full py-2 rounded font-medium transition ${
                            review.loading
                              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                              : review.action === 'approve'
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {review.loading ? 'Procesando...' : `${review.action === 'approve' ? 'Aprobar' : 'Rechazar'} Robot`}
                        </button>
                      </div>
                    )}

                    {/* Status Badge */}
                    {selectedRobot.status !== 'pending' && (
                      <div className={`p-4 rounded-lg ${
                        selectedRobot.status === 'approved'
                          ? 'bg-green-900 border border-green-600 text-green-200'
                          : 'bg-red-900 border border-red-600 text-red-200'
                      }`}>
                        <p className="font-semibold">
                          {selectedRobot.status === 'approved' 
                            ? '✓ Este robot ha sido aprobado' 
                            : '✕ Este robot ha sido rechazado'}
                        </p>
                        {selectedRobot.comments && (
                          <p className="text-sm mt-2">{selectedRobot.comments}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-6 text-center">
                    <p className="text-gray-400">Selecciona un robot para ver los detalles</p>
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
