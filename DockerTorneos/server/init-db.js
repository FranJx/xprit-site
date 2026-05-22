const fs = require('fs');
const path = require('path');
const db = require('./db');

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, 'migrations', 'init.sql'), 'utf8');
  try {
    await db.pool.query(sql);
    console.log('DB initialized');
    process.exit(0);
  } catch (err) {
    console.error('DB init error', err);
    process.exit(1);
  }
}

run();
