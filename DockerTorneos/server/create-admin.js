const bcrypt = require('bcrypt');
const db = require('./db');

async function createAdmin() {
  try {
    const username = 'admin';
    const password = 'admin123'; // Cambiar esto
    const role = 'admin';

    // Check if admin already exists
    const exists = await db.query('SELECT id FROM users WHERE username=$1', [username]);
    if (exists.rows.length > 0) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users(username, password_hash, role) VALUES($1,$2,$3) RETURNING id, username, role',
      [username, hash, role]
    );

    console.log('✅ Admin created:', result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
