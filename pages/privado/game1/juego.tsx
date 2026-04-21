import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Game from '@/components/Game';
import { useRouter } from 'next/router';

export default function JuegoPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [gameKey, setGameKey] = useState<number>(0);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Generar o cargar userId del localStorage
    let storedUserId = localStorage.getItem('gameUserId');
    let storedUserName = localStorage.getItem('gameUserName');

    if (!storedUserId) {
      // Generar nuevo userId
      storedUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('gameUserId', storedUserId);
      setShowNameInput(true);
    } else if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setShowNameInput(true);
    }

    setUserId(storedUserId);
    setLoading(false);
  }, []);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputName.trim()) {
      alert('Por favor ingresa un nombre');
      return;
    }

    try {
      const response = await fetch('/api/game/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name: inputName.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setUserName(data.user.name);
        localStorage.setItem('gameUserName', data.user.name);
        setShowNameInput(false);
        loadStats();
      }
    } catch (error) {
      console.error('Error al guardar nombre:', error);
      alert('Error al guardar tu nombre');
    }
  };

  const loadStats = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/game/ranking?userId=${userId}`);
      const data = await response.json();

      if (data.success && data.userStats) {
        setStats(data.userStats);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleGameEnd = async (attempts: number) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/game/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, attempts }),
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        // Esperar un poco y luego generar nueva partida
        setTimeout(() => {
          setGameKey((prev) => prev + 1);
        }, 2000);
      }
    } catch (error) {
      console.error('Error al guardar resultado:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-cyan-500/20 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-400">🎮 Juego de Adivinanzas</h1>
          <button
            onClick={() => router.push('/privado/game1/tabla')}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Ver Ranking 📊
          </button>
        </div>
      </motion.header>

      {/* Modal de nombre */}
      {showNameInput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gray-800 border border-cyan-500 rounded-lg p-8 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Bienvenido 👋</h2>
            <p className="text-gray-400 mb-6">
              Esta es tu primera vez. ¿Cuál es tu nombre?
            </p>

            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 mb-4"
                autoFocus
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 rounded-lg transition-all"
              >
                Continuar
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Contenido principal */}
      {!showNameInput && (
        <div className="container mx-auto px-4 py-8">
          {/* Estadísticas */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">Promedio</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {stats.averageAttempts.toFixed(1)}
                </p>
              </div>
              <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">Ganadas</p>
                <p className="text-2xl font-bold text-green-400">{stats.gamesWon}</p>
              </div>
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">Perdidas</p>
                <p className="text-2xl font-bold text-red-400">{stats.gamesLost}</p>
              </div>
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">Total</p>
                <p className="text-2xl font-bold text-purple-400">
                  {stats.totalGames}
                </p>
              </div>
            </motion.div>
          )}

          {/* Componente del juego */}
          <motion.div
            key={gameKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-cyan-500/20 rounded-lg p-8"
          >
            <Game userName={userName} onGameEnd={handleGameEnd} />
          </motion.div>
        </div>
      )}
    </div>
  );
}
