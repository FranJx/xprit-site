import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('🗑️  Limpiando base de datos...\n');

    // Eliminar resultados primero (por la relación de foreign key)
    const deletedResults = await prisma.gameResult.deleteMany({});
    console.log(`✅ Eliminados ${deletedResults.count} resultados de juego`);

    // Eliminar usuarios
    const deletedUsers = await prisma.gameUser.deleteMany({});
    console.log(`✅ Eliminados ${deletedUsers.count} usuarios\n`);

    console.log('🎉 Base de datos completamente limpia!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
