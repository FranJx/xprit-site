import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface RobotSubmission {
  id: string;
  name: string;
  status: string;
  submittedAt: string;
  comments: string | null;
}

export default function MySubmissions() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<RobotSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('team_token');
    const savedUsername = localStorage.getItem('team_username');

    if (!savedToken || !savedUsername) {
      router.push('/team/login');
      return;
    }

    setToken(savedToken);
    setUsername(savedUsername);
    // TODO: Fetch user's submissions from API
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('team_token');
    localStorage.removeItem('team_username');
    router.push('/team/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-900 text-yellow-200 rounded-full text-sm">⏳ Pendiente</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-900 text-green-200 rounded-full text-sm">✓ Aprobado</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-900 text-red-200 rounded-full text-sm">✕ Rechazado</span>;
      default:
        return null;
    }
  };

  if (!token) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <>
      <Head>
        <title>Mis Envíos - XPRIT Robotics</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Mis Envíos</h1>
              <p className="text-gray-400 mt-1">Histórico de robots enviados</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Salir
            </button>
          </div>

          {/* Submissions List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Cargando...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <p className="text-gray-400 mb-4">Aún no has enviado ningún robot</p>
              <button
                onClick={() => router.push('/member-menu/upload')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Cargar Robot
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub => (
                <div key={sub.id} className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">{sub.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Enviado: {new Date(sub.submittedAt).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>

                  {sub.comments && (
                    <div className="mt-4 p-3 bg-gray-700 rounded text-sm text-gray-200">
                      <p className="text-gray-400 text-xs mb-1">Comentarios:</p>
                      <p>{sub.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
