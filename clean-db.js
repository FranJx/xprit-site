#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:BnwRqpcZvjHwFKYhKWYfeXeGoUHGkYJM@metro.proxy.rlwy.net:12906/railway'
    }
  }
});

async function cleanDatabase() {
  try {
    console.log('🗑️  Limpiando base de datos...\n');

    // Eliminar resultados primero
    const deletedResults = await prisma.gameResult.deleteMany({});
    console.log(`✅ Eliminados ${deletedResults.count} resultados de juego`);

    // Eliminar usuarios
    const deletedUsers = await prisma.gameUser.deleteMany({});
    console.log(`✅ Eliminados ${deletedUsers.count} usuarios\n`);

    console.log('🎉 Base de datos completamente limpia!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
