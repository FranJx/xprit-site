import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

interface RankingEntry {
  userId: string;
  userName: string;
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  averageAttempts: number;
}

export default function TablasPage() {
  const router = useRouter();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('gameUserId');
    setUserId(storedUserId || '');
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      const response = await fetch('/api/game/ranking');
      const data = await response.json();

      if (data.success && data.ranking) {
        setRanking(data.ranking);
      }
    } catch (error) {
      console.error('Error al cargar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (position: number) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return `#${position + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-cyan-500/20 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-400">🏆 Ranking Global</h1>
          <button
            onClick={() => router.push('/privado/game1/juego')}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Jugar 🎮
          </button>
        </div>
      </motion.header>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-12"
          >
            <p className="text-xl">Cargando ranking...</p>
          </motion.div>
        ) : ranking.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-xl mb-4">
              Aún no hay jugadores con partidas ganadas
            </p>
            <button
              onClick={() => router.push('/privado/game1/juego')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Ser el primero 🚀
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Top 3 Destacado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {ranking.slice(0, 3).map((entry, idx) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`border rounded-lg p-6 text-center ${
                    idx === 0
                      ? 'bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-500'
                      : idx === 1
                      ? 'bg-gradient-to-br from-gray-700/50 to-gray-600/30 border-gray-500'
                      : 'bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500'
                  }`}
                >
                  <p className="text-4xl mb-2">{getMedalEmoji(idx)}</p>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {entry.userName}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-gray-300">
                      <span className="font-semibold text-cyan-400">
                        {entry.averageAttempts.toFixed(1)}
                      </span>{' '}
                      intentos promedio
                    </p>
                    <p className="text-gray-400 text-sm">
                      {entry.gamesWon} ganadas de {entry.totalGames}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tabla completa */}
            <div className="bg-gray-800/50 border border-cyan-500/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-500/20 bg-gray-900/50">
                      <th className="px-4 py-4 text-left text-cyan-400 font-semibold">
                        Posición
                      </th>
                      <th className="px-4 py-4 text-left text-cyan-400 font-semibold">
                        Jugador
                      </th>
                      <th className="px-4 py-4 text-center text-cyan-400 font-semibold">
                        Promedio
                      </th>
                      <th className="px-4 py-4 text-center text-cyan-400 font-semibold">
                        Ganadas
                      </th>
                      <th className="px-4 py-4 text-center text-cyan-400 font-semibold">
                        Jugadas
                      </th>
                      <th className="px-4 py-4 text-center text-cyan-400 font-semibold">
                        Perdidas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((entry, idx) => {
                      const isCurrentUser = entry.userId === userId;
                      return (
                        <motion.tr
                          key={entry.userId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`border-b border-gray-700 transition-colors ${
                            isCurrentUser
                              ? 'bg-cyan-900/20 hover:bg-cyan-900/30'
                              : 'hover:bg-gray-700/30'
                          }`}
                        >
                          <td className="px-4 py-4 text-cyan-400 font-semibold">
                            {getMedalEmoji(idx)}
                          </td>
                          <td className="px-4 py-4 text-white font-semibold">
                            {entry.userName}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded">
                                Tú
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="bg-cyan-600/30 text-cyan-300 px-3 py-1 rounded-full font-semibold">
                              {entry.averageAttempts.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-green-400 font-semibold">
                              {entry.gamesWon}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-purple-400 font-semibold">
                              {entry.totalGames}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-red-400 font-semibold">
                              {entry.gamesLost}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 text-center text-gray-300"
            >
              <p className="text-sm">
                💡 Solo se muestran jugadores con al menos 1 partida ganada. El ranking está
                ordenado por promedio de intentos (menor es mejor).
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
