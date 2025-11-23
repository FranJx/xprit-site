import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function MemberMenu() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUsername = localStorage.getItem('team_username');
    const savedToken = localStorage.getItem('team_token');

    if (!savedToken || !savedUsername) {
      router.push('/team/login');
      return;
    }

    setUsername(savedUsername);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('team_token');
    localStorage.removeItem('team_username');
    router.push('/team/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <>
      <Head>
        <title>Panel de Miembro - XPRIT Robotics</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white">Panel de Miembro</h1>
              <p className="text-gray-400 mt-2">Bienvenido, <span className="text-blue-400 font-semibold">{username}</span></p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Salir
            </button>
          </div>

          {/* Menu Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Robot */}
            <Link href="/member-menu/upload">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-8 hover:from-blue-800 hover:to-blue-700 transition cursor-pointer border border-blue-600">
                <div className="text-4xl mb-4">🤖</div>
                <h2 className="text-2xl font-bold text-white mb-2">Cargar Robot</h2>
                <p className="text-blue-200">Sube los datos y fotos de tu robot nuevo</p>
              </div>
            </Link>

            {/* Mis Envíos */}
            <Link href="/member-menu/submissions">
              <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-8 hover:from-purple-800 hover:to-purple-700 transition cursor-pointer border border-purple-600">
                <div className="text-4xl mb-4">📋</div>
                <h2 className="text-2xl font-bold text-white mb-2">Mis Envíos</h2>
                <p className="text-purple-200">Ver el estado de tus robots enviados</p>
              </div>
            </Link>

            {/* Próximamente */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-8 opacity-50 cursor-not-allowed border border-gray-600">
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-gray-400 mb-2">Más opciones</h2>
              <p className="text-gray-500">Próximamente...</p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-12 p-6 bg-blue-900 border border-blue-600 rounded-lg text-blue-200">
            <p className="font-semibold mb-2">ℹ️ Información:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Completa el formulario con los datos de tu robot</li>
              <li>Sube imágenes claras de buena calidad</li>
              <li>Recibirás notificación cuando tu robot sea aprobado</li>
              <li>Una vez aprobado, aparecerá en la galería pública</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
