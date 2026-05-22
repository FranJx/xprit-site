require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const judges = [
  { username: 'juez1', password: 'juez1234' },
  { username: 'juez2', password: 'juez1234' },
  { username: 'juez3', password: 'juez1234' },
  { username: 'juez4', password: 'juez1234' },
];

async function upsertJudge(username, password) {
  const hash = await bcrypt.hash(password, 10);
  const res = await db.query(
    `INSERT INTO users(username, password_hash, role)
     VALUES($1, $2, $3)
     ON CONFLICT (username)
     DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
     RETURNING id, username`,
    [username, hash, 'juez']
  );
  return res.rows[0];
}

async function main() {
  try {
    const secret = process.env.JWT_SECRET || 'replace_this_with_a_secret';
    const created = [];

    for (const j of judges) {
      const row = await upsertJudge(j.username, j.password);
      const token = jwt.sign({ id: row.id, username: row.username, role: 'juez' }, secret, { expiresIn: '30d' });
      created.push({ username: row.username, password: j.password, id: row.id, token });
    }

    console.log('Created/updated judges:');
    created.forEach(c => {
      console.log(`- ${c.username} (id: ${c.id})`);
      console.log(`  password: ${c.password}`);
      console.log(`  token: ${c.token}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error creating judges', err);
    process.exit(1);
  }
}

main();
