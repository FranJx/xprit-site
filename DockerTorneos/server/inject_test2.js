const { Client } = require('pg');

const connectionString = 'postgres://postgres:postgres@localhost:5433/torneo_dev';

// Cambia solo esto para reutilizar el script rápidamente.
const tournamentName = 'TEST10';

const participants = [
  'Rayo Rojo', 'Trueno Azul', 'Aplastador', 'Titán de Hierro',
  'Cobra Metálica', 'Destello'
];

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database.');

    // Find or create the target tournament
    let tourRes = await client.query('SELECT id FROM tournaments WHERE name = $1', [tournamentName]);
    let tournamentId;

    if (tourRes.rows.length > 0) {
      tournamentId = tourRes.rows[0].id;
      console.log(`Found existing tournament "${tournamentName}" with ID: ${tournamentId}`);
    } else {
      const insertTour = await client.query(
        'INSERT INTO tournaments(name, registration_open) VALUES($1, true) RETURNING id',
        [tournamentName]
      );
      tournamentId = insertTour.rows[0].id;
      console.log(`Created new tournament "${tournamentName}" with ID: ${tournamentId}`);
    }

    // Insert participants
    let insertedCount = 0;
    for (const name of participants) {
      // Check if team name already exists for this tournament
      const dup = await client.query('SELECT id FROM teams WHERE tournament_id = $1 AND name = $2', [tournamentId, name]);
      if (dup.rows.length > 0) {
        console.log(`Skipping duplicate team: ${name}`);
        continue;
      }

      await client.query('INSERT INTO teams(tournament_id, name) VALUES($1, $2)', [tournamentId, name]);
      insertedCount++;
    }

    console.log(`Successfully injected ${insertedCount} participants into the tournament!`);

  } catch (err) {
    console.error('Error running script:', err);
  } finally {
    await client.end();
  }
}

run();
