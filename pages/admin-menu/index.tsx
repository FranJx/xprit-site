import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Robot {
  id: string;
  name: string;
  slug: string;
  battery?: string;
  category: string;
  motors?: string;
  yearCreated: number;
  description?: string;
  mainImage?: string;
  photos: string[];
  status: string;
  comments?: string;
  submittedBy: string;
  submittedAt: string;
}

export default function AdminMenu() {
  const router = useRouter();
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [comments, setComments] = useState('');
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Cargar robots al montar el componente
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('team_token');
      const isAdmin = localStorage.getItem('team_isAdmin');

      // Verificar autenticación
      if (!token || isAdmin !== 'true') {
        router.push('/team/login');
        return;
      }

      // Cargar robots
      try {
        const res = await fetch('/api/robots/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        
        const data = await res.json();
        setRobots(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando robots');
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const handleApprove = async () => {
    if (!selectedRobot) return;

    setApproving(true);
    const token = localStorage.getItem('team_token');

    try {
      const res = await fetch('/api/robots/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ robotId: selectedRobot.id, comments }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setSuccess('✓ Robot aprobado');
      setSelectedRobot(null);
      setComments('');

      setTimeout(() => {
        setSuccess('');
        // Recargar lista
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error aprobando robot');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRobot) return;

    setRejecting(true);
    const token = localStorage.getItem('team_token');

    try {
      const res = await fetch('/api/robots/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ robotId: selectedRobot.id, comments }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setSuccess('✓ Robot rechazado');
      setSelectedRobot(null);
      setComments('');

      setTimeout(() => {
        setSuccess('');
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error rechazando robot');
    } finally {
      setRejecting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/team/login');
  };

  const pendingRobots = robots.filter(r => r.status === 'pending');

  return (
    <>
      <Head>
        <title>Panel Admin - XPRIT Robotics</title>
      </Head>

      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Panel de Administrador</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Salir
            </button>
          </div>

          {/* Messages */}
          {error && <div className="mb-4 p-4 bg-red-900 text-red-200 rounded">{error}</div>}
          {success && <div className="mb-4 p-4 bg-green-900 text-green-200 rounded">{success}</div>}

          {/* Loading */}
          {loading && <div className="text-center py-12 text-gray-400">Cargando...</div>}

          {/* Content */}
          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Robot List */}
              <div className="lg:col-span-1 bg-gray-800 rounded-lg p-4">
                <h2 className="text-lg font-bold text-white mb-4">Pendientes ({pendingRobots.length})</h2>
                {pendingRobots.length === 0 ? (
                  <p className="text-gray-400 text-sm">Sin robots pendientes</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pendingRobots.map(r => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setSelectedRobot(r);
                          setImageError(false);
                        }}
                        className={`w-full text-left p-2 rounded text-sm ${
                          selectedRobot?.id === r.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        <div className="font-semibold truncate">{r.name}</div>
                        <div className="text-xs opacity-75">{r.category}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Robot Details */}
              <div className="lg:col-span-3 bg-gray-800 rounded-lg p-6">
                {selectedRobot ? (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-4">{selectedRobot.name}</h2>

                    {selectedRobot.mainImage && (
                      <div className="mb-4 bg-gray-700 rounded-lg p-4">
                        <div className="w-full h-48 bg-gray-900 rounded overflow-hidden flex items-center justify-center">
                          {imageError ? (
                            <div className="text-center">
                              <p className="text-gray-400 text-sm">Error cargando imagen</p>
                              <p className="text-gray-500 text-xs mt-2">{selectedRobot.mainImage}</p>
                            </div>
                          ) : (
                            <img
                              src={selectedRobot.mainImage}
                              alt={selectedRobot.name}
                              className="w-full h-full object-contain"
                              onError={() => {
                                setImageError(true);
                                console.error('Image load error:', selectedRobot.mainImage);
                              }}
                              onLoad={() => setImageError(false)}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Categoría</p>
                        <p className="text-white font-semibold">{selectedRobot.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Año</p>
                        <p className="text-white font-semibold">{selectedRobot.yearCreated}</p>
                      </div>
                      {selectedRobot.battery && (
                        <div>
                          <p className="text-gray-400 text-sm">Batería</p>
                          <p className="text-white">{selectedRobot.battery}</p>
                        </div>
                      )}
                      {selectedRobot.motors && (
                        <div>
                          <p className="text-gray-400 text-sm">Motores</p>
                          <p className="text-white">{selectedRobot.motors}</p>
                        </div>
                      )}
                    </div>

                    {selectedRobot.description && (
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm">Descripción</p>
                        <p className="text-white bg-gray-700 p-2 rounded text-sm">{selectedRobot.description}</p>
                      </div>
                    )}

                    <textarea
                      value={comments}
                      onChange={e => setComments(e.target.value)}
                      placeholder="Comentarios..."
                      className="w-full bg-gray-700 text-white rounded p-2 mb-4 text-sm"
                      rows={3}
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleApprove}
                        disabled={approving}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 rounded"
                      >
                        {approving ? 'Aprobando...' : 'Aprobar'}
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={rejecting}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 rounded"
                      >
                        {rejecting ? 'Rechazando...' : 'Rechazar'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-center py-12">Selecciona un robot</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
