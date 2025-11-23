import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function TeamLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpiar localStorage al cargar la página (asegurar que tokens viejos no causen problemas)
  useEffect(() => {
    localStorage.removeItem('team_token');
    localStorage.removeItem('team_username');
    localStorage.removeItem('team_isAdmin');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error de autenticación');
        setLoading(false);
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem('team_token', data.token);
      localStorage.setItem('team_username', data.username);
      localStorage.setItem('team_isAdmin', data.isAdmin ? 'true' : 'false');

      // Redirigir basado en el rol
      if (data.isAdmin) {
        router.push('/admin-menu');
      } else {
        router.push('/member-menu');
      }
    } catch (err) {
      setError('Error de conexión');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Panel del Equipo - XpriT Robotics</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-center mb-2 text-cyan-400">XpriT Robotics</h1>
            <p className="text-center text-gray-400 mb-8">Panel del Equipo</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="Tu usuario"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="Tu contraseña"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando sesión...' : 'Ingresar'}
              </button>
            </form>

            <p className="text-center text-gray-500 text-xs mt-6">
              Este panel es solo para miembros del equipo XpriT
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
