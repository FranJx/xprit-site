const { Client } = require('pg');

const connectionString = 'postgres://postgres:postgres@localhost:5433/torneo_dev';

const participants = [
  'Mini-Terminator', 'Rayo Macuin', 'Sub-Zero', 'Escorpión Metálico',
  'Toro Mecánico', 'Avispa Negra', 'Chispas', 'Centella',
  'Destructor 3000', 'Robocut', 'Mini-Titan', 'Sombra Negra',
  'El Hierros', 'Caballero Oxidado', 'Cortocircuito', 'Halcón Solar',
  'Ninja Rojo', 'Trompo Veloz', 'Tsunami', 'Megatrón'
];

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to the database.');

    // Find or create tournament
    let tourRes = await client.query('SELECT id FROM tournaments WHERE name = $1', ['Minisumo Pro Test1']);
    let tournamentId;

    if (tourRes.rows.length > 0) {
      tournamentId = tourRes.rows[0].id;
      console.log(`Found existing tournament "Minisumo Pro Test1" with ID: ${tournamentId}`);
    } else {
      const insertTour = await client.query(
        'INSERT INTO tournaments(name, registration_open) VALUES($1, true) RETURNING id',
        ['Minisumo Pro Test1']
      );
      tournamentId = insertTour.rows[0].id;
      console.log(`Created new tournament "Minisumo Pro Test1" with ID: ${tournamentId}`);
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
