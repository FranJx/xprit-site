require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db');

async function main() {
  const username = process.env.SEED_USERNAME || 'admin';
  const password = process.env.SEED_PASSWORD || 'admin123';
  const role = process.env.SEED_ROLE || 'admin';

  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      `INSERT INTO users(username, password_hash, role)
       VALUES($1, $2, $3)
       ON CONFLICT (username)
       DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
      [username, hash, role]
    );
    console.log(`Seeded user ${username} (${role})`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

main();
