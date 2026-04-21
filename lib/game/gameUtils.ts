import fs from 'fs';
import path from 'path';

const GAMES_DATA_FILE = path.join(process.cwd(), 'data', 'games.json');

export interface User {
  id: string;
  name: string;
  createdAt: string;
}

export interface GameResult {
  userId: string;
  attempts: number;
  date: string;
  won: boolean;
}

export interface GameData {
  users: { [key: string]: User };
  results: GameResult[];
}

// Inicializar el archivo de datos si no existe
export function ensureDataFileExists(): void {
  if (!fs.existsSync(GAMES_DATA_FILE)) {
    const initialData: GameData = { users: {}, results: [] };
    fs.mkdirSync(path.dirname(GAMES_DATA_FILE), { recursive: true });
    fs.writeFileSync(GAMES_DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Leer datos del archivo
export function readGameData(): GameData {
  ensureDataFileExists();
  const data = fs.readFileSync(GAMES_DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Escribir datos al archivo
export function writeGameData(data: GameData): void {
  ensureDataFileExists();
  fs.writeFileSync(GAMES_DATA_FILE, JSON.stringify(data, null, 2));
}

// Crear o obtener usuario
export function getOrCreateUser(userId: string, name?: string): User {
  const data = readGameData();
  
  if (data.users[userId]) {
    return data.users[userId];
  }
  
  const newUser: User = {
    id: userId,
    name: name || `Jugador_${userId.substring(0, 6)}`,
    createdAt: new Date().toISOString(),
  };
  
  data.users[userId] = newUser;
  writeGameData(data);
  
  return newUser;
}

// Actualizar nombre del usuario
export function updateUserName(userId: string, name: string): User {
  const data = readGameData();
  
  if (!data.users[userId]) {
    return getOrCreateUser(userId, name);
  }
  
  data.users[userId].name = name;
  writeGameData(data);
  
  return data.users[userId];
}

// Guardar resultado de partida
export function saveGameResult(userId: string, attempts: number, won: boolean): GameResult {
  const data = readGameData();
  
  const result: GameResult = {
    userId,
    attempts,
    date: new Date().toISOString(),
    won,
  };
  
  data.results.push(result);
  writeGameData(data);
  
  return result;
}

// Obtener estadísticas del usuario
export function getUserStats(userId: string) {
  const data = readGameData();
  const userResults = data.results.filter((r) => r.userId === userId);
  
  const winResults = userResults.filter((r) => r.won);
  
  return {
    totalGames: userResults.length,
    gamesWon: winResults.length,
    gamesLost: userResults.length - winResults.length,
    averageAttempts: winResults.length > 0 
      ? Math.round((winResults.reduce((sum, r) => sum + r.attempts, 0) / winResults.length) * 100) / 100
      : 0,
  };
}

// Obtener ranking global
export function getGlobalRanking() {
  const data = readGameData();
  
  const ranking = Object.values(data.users).map((user) => {
    const userResults = data.results.filter((r) => r.userId === user.id);
    const winResults = userResults.filter((r) => r.won);
    
    return {
      userId: user.id,
      userName: user.name,
      totalGames: userResults.length,
      gamesWon: winResults.length,
      gamesLost: userResults.length - winResults.length,
      averageAttempts: winResults.length > 0
        ? Math.round((winResults.reduce((sum, r) => sum + r.attempts, 0) / winResults.length) * 100) / 100
        : 0,
    };
  });
  
  // Ordenar por promedio de intentos (menor primero), pero solo contar usuarios con al menos 1 partida ganada
  return ranking
    .filter((r) => r.gamesWon > 0)
    .sort((a, b) => {
      if (a.averageAttempts === 0) return 1;
      if (b.averageAttempts === 0) return -1;
      return a.averageAttempts - b.averageAttempts;
    });
}

// Generar número secreto
export function generateSecretNumber(): number {
  return Math.floor(Math.random() * 100) + 1;
}
