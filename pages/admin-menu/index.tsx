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
  comments: string | null;
  submittedBy: string;
  submittedAt: string;
}

export default function AdminMenu() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [robots, setRobots] = useState<RobotSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRobot, setSelectedRobot] = useState<RobotSubmission | null>(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('team_token');
    const savedUsername = localStorage.getItem('team_username');

    if (!savedToken || !savedUsername) {
      router.push('/team/login');
      return;
    }

    // Only admin (fran) can access
    if (savedUsername !== 'fran') {
      router.push('/member-menu');
      return;
    }

    setToken(savedToken);
    setUsername(savedUsername);
    fetchRobots(savedToken);
  }, [router]);

  const fetchRobots = async (authToken: string) => {
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

  const handleApprove = async () => {
    if (!selectedRobot || !token) return;

    setApproving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/robots/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          robotId: selectedRobot.id,
          comments,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error approving robot');
      }

      setSuccess('✓ Robot aprobado exitosamente');
      setSelectedRobot(null);
      setComments('');

      // Refresh list
      setTimeout(() => {
        if (token) fetchRobots(token);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRobot || !token) return;

    setRejecting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/robots/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          robotId: selectedRobot.id,
          comments,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error rejecting robot');
      }

      setSuccess('✓ Robot rechazado');
      setSelectedRobot(null);
      setComments('');

      // Refresh list
      setTimeout(() => {
        if (token) fetchRobots(token);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setRejecting(false);
    }
  };

  const pendingRobots = robots.filter(r => r.status === 'pending');

  if (!token || username !== 'fran') {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <>
      <Head>
        <title>Panel de Admin - XPRIT Robotics</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Panel de Administrador</h1>
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
              {success}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Cargando robots...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de robots pendientes */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Robots Pendientes ({pendingRobots.length})
                  </h2>

                  {pendingRobots.length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay robots pendientes</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {pendingRobots.map(robot => (
                        <button
                          key={robot.id}
                          onClick={() => {
                            setSelectedRobot(robot);
                            setComments('');
                          }}
                          className={`w-full text-left p-3 rounded transition ${
                            selectedRobot?.id === robot.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          }`}
                        >
                          <div className="font-medium truncate">{robot.name}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Por: {robot.submittedBy}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(robot.submittedAt).toLocaleDateString('es-AR')}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Detalles del robot */}
              <div className="lg:col-span-2">
                {selectedRobot ? (
                  <div className="bg-gray-800 rounded-lg p-6">
                    {/* Imagen principal */}
                    {selectedRobot.mainImage && (
                      <div className="mb-6">
                        <img
                          src={selectedRobot.mainImage}
                          alt={selectedRobot.name}
                          className="w-full h-64 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                    )}

                    {/* Información */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-gray-400 text-sm">Nombre</p>
                        <p className="text-white font-semibold">{selectedRobot.name}</p>
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
                      <div>
                        <p className="text-gray-400 text-sm">Enviado por</p>
                        <p className="text-white font-semibold">{selectedRobot.submittedBy}</p>
                      </div>
                    </div>

                    {/* Descripción */}
                    {selectedRobot.description && (
                      <div className="mb-6">
                        <p className="text-gray-400 text-sm mb-2">Descripción</p>
                        <p className="text-white bg-gray-700 p-3 rounded text-sm">
                          {selectedRobot.description}
                        </p>
                      </div>
                    )}

                    {/* Fotos */}
                    {selectedRobot.photos && selectedRobot.photos.length > 0 && (
                      <div className="mb-6">
                        <p className="text-gray-400 text-sm mb-2">Fotos Adicionales</p>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedRobot.photos.map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-24 object-cover rounded border border-gray-600 cursor-pointer hover:opacity-75"
                              onClick={() => window.open(photo, '_blank')}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comentarios */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Comentarios (opcional)
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Agrega comentarios para el equipo..."
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleApprove}
                        disabled={approving}
                        className={`flex-1 py-2 rounded font-medium transition ${
                          approving
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {approving ? 'Aprobando...' : '✓ Aprobar'}
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={rejecting}
                        className={`flex-1 py-2 rounded font-medium transition ${
                          rejecting
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {rejecting ? 'Rechazando...' : '✕ Rechazar'}
                      </button>
                    </div>
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
