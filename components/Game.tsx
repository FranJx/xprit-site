import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GameProps {
  userName: string;
  onGameEnd: (attempts: number) => void;
}

export default function Game({ userName, onGameEnd }: GameProps) {
  const [secretNumber, setSecretNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [feedback, setFeedback] = useState<string>('');
  const [attemptsList, setAttemptsList] = useState<number[]>([]);

  useEffect(() => {
    // Generar número secreto al montar el componente
    const newSecret = Math.floor(Math.random() * 100) + 1;
    setSecretNumber(newSecret);
  }, []);

  const handleGuess = () => {
    const parsedGuess = parseInt(guess);

    if (isNaN(parsedGuess) || parsedGuess < 1 || parsedGuess > 100) {
      setFeedback('❌ Por favor ingresa un número entre 1 y 100');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setAttemptsList([...attemptsList, parsedGuess]);
    setGuess('');

    if (parsedGuess === secretNumber) {
      setGameStatus('won');
      setFeedback('🎉 ¡Ganaste! ¡Lo adivinaste!');
      // Llamar a la función para guardar el resultado
      setTimeout(() => {
        onGameEnd(newAttempts);
      }, 1500);
    } else if (newAttempts >= 15) {
      setGameStatus('lost');
      setFeedback(`😢 Se acabaron los intentos. El número era ${secretNumber}`);
      setTimeout(() => {
        onGameEnd(newAttempts);
      }, 1500);
    } else if (parsedGuess < secretNumber) {
      setFeedback('📈 El número es mayor');
    } else {
      setFeedback('📉 El número es menor');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameStatus === 'playing') {
      handleGuess();
    }
  };

  const remainingAttempts = 15 - attempts;
  const progressPercent = (attempts / 15) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-cyan-400 mb-2">
          Adivina el Número
        </h2>
        <p className="text-gray-400 text-lg">¡Hola, {userName}! 👋</p>
      </motion.div>

      {/* Información del juego */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg p-6 mb-8"
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Intentos Usados</p>
            <p className="text-3xl font-bold text-cyan-400">{attempts}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Intentos Restantes</p>
            <p className="text-3xl font-bold text-orange-400">{remainingAttempts}</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Entrada de adivinanza */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            min="1"
            max="100"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={gameStatus !== 'playing'}
            placeholder="Ingresa un número (1-100)"
            className="flex-1 bg-gray-800 border border-cyan-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleGuess}
            disabled={gameStatus !== 'playing'}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            Adivinar
          </button>
        </div>

        {/* Feedback */}
        <motion.div
          key={feedback}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center text-lg font-semibold p-4 rounded-lg ${
            gameStatus === 'won'
              ? 'bg-green-900/30 border border-green-500 text-green-400'
              : gameStatus === 'lost'
              ? 'bg-red-900/30 border border-red-500 text-red-400'
              : feedback.includes('mayor')
              ? 'bg-orange-900/30 border border-orange-500 text-orange-400'
              : feedback.includes('menor')
              ? 'bg-purple-900/30 border border-purple-500 text-purple-400'
              : 'bg-gray-800 border border-gray-600 text-gray-300'
          }`}
        >
          {feedback}
        </motion.div>
      </motion.div>

      {/* Historial de intentos */}
      {attemptsList.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 border border-gray-600 rounded-lg p-4"
        >
          <p className="text-gray-400 text-sm mb-3">Tus adivinanzas:</p>
          <div className="flex flex-wrap gap-2">
            {attemptsList.map((num, idx) => (
              <motion.span
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  num === secretNumber
                    ? 'bg-green-600 text-white'
                    : num < secretNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {num}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mensaje final */}
      {gameStatus !== 'playing' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400">
            {gameStatus === 'won'
              ? '✨ Felicidades, acertaste en ' + attempts + ' intento' + (attempts === 1 ? '' : 's') + ' ✨'
              : '🔄 Intenta de nuevo'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
