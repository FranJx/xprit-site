import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

// Crear o obtener usuario
export async function getOrCreateUser(userId: string, name?: string): Promise<User> {
  let user = await prisma.gameUser.findUnique({
    where: { id: userId },
  });

  if (!user) {
    user = await prisma.gameUser.create({
      data: {
        id: userId,
        name: name || `Jugador_${userId.substring(0, 6)}`,
      },
    });
  }

  return {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}

// Actualizar nombre del usuario
export async function updateUserName(userId: string, name: string): Promise<User> {
  const user = await prisma.gameUser.upsert({
    where: { id: userId },
    update: { name },
    create: {
      id: userId,
      name,
    },
  });

  return {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}

// Guardar resultado de partida
export async function saveGameResult(userId: string, attempts: number, won: boolean): Promise<GameResult> {
  // Crear usuario si no existe
  await getOrCreateUser(userId);

  const result = await prisma.gameResult.create({
    data: {
      userId,
      attempts,
      won,
    },
  });

  return {
    userId: result.userId,
    attempts: result.attempts,
    date: result.date.toISOString(),
    won: result.won,
  };
}

// Obtener estadísticas del usuario
export async function getUserStats(userId: string) {
  const userResults = await prisma.gameResult.findMany({
    where: { userId },
  });

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
export async function getGlobalRanking() {
  const users = await prisma.gameUser.findMany({
    include: {
      results: true,
    },
  });

  const ranking = users.map((user) => {
    const winResults = user.results.filter((r) => r.won);

    return {
      userId: user.id,
      userName: user.name,
      totalGames: user.results.length,
      gamesWon: winResults.length,
      gamesLost: user.results.length - winResults.length,
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

