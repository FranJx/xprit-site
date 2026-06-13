const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT t.*, COUNT(te.id)::int AS team_count FROM tournaments t LEFT JOIN teams te ON te.tournament_id = t.id GROUP BY t.id ORDER BY t.id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not list tournaments' });
  }
});

router.get('/:id', async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const result = await db.query('SELECT t.*, COUNT(te.id)::int AS team_count FROM tournaments t LEFT JOIN teams te ON te.tournament_id = t.id WHERE t.id=$1 GROUP BY t.id', [tournamentId]);
    const tournament = result.rows[0];
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    const teams = await db.query('SELECT id, name, user_id FROM teams WHERE tournament_id=$1 ORDER BY id', [tournamentId]);
    res.json({ ...tournament, teams: teams.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load tournament' });
  }
});

// Import/Feed a tournament with participants at once (admin only)
router.post('/import', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { name, participants } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ error: 'Missing participants (must be a non-empty array)' });
  }

  try {
    await db.query('BEGIN');

    // Create tournament
    const tourres = await db.query(
      'INSERT INTO tournaments(name, registration_open) VALUES($1, true) RETURNING *',
      [name]
    );
    const tournament = tourres.rows[0];

    // Filter valid names (strings or objects with name)
    const teamsToInsert = participants.map(p => {
      if (typeof p === 'string') return p.trim();
      if (p && typeof p === 'object' && p.name) return p.name.trim();
      return null;
    }).filter(Boolean);

    if (teamsToInsert.length === 0) {
      await db.query('ROLLBACK');
      return res.status(400).json({ error: 'No valid participant names found' });
    }

    const insertedTeams = [];
    for (const teamName of teamsToInsert) {
      const teamres = await db.query(
        'INSERT INTO teams(tournament_id, name) VALUES($1, $2) RETURNING *',
        [tournament.id, teamName]
      );
      insertedTeams.push(teamres.rows[0]);
    }

    await db.query('COMMIT');
    res.json({
      success: true,
      tournament: {
        ...tournament,
        teams: insertedTeams
      }
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Import tournament error:', err);
    res.status(500).json({ error: 'Could not import tournament and participants' });
  }
});

// Import/Add multiple participants to an existing tournament (admin only)
router.post('/:id/import', authenticateToken, requireRole(['admin']), async (req, res) => {
  const tournamentId = req.params.id;
  const { participants } = req.body;
  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ error: 'Missing participants (must be a non-empty array)' });
  }

  try {
    // Check if tournament exists
    const tourres = await db.query('SELECT id, registration_open FROM tournaments WHERE id=$1', [tournamentId]);
    const tournament = tourres.rows[0];
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (!tournament.registration_open) return res.status(400).json({ error: 'Registrations are closed for this tournament' });

    // Filter valid names (strings or objects with name)
    const teamsToInsert = participants.map(p => {
      if (typeof p === 'string') return p.trim();
      if (p && typeof p === 'object' && p.name) return p.name.trim();
      return null;
    }).filter(Boolean);

    if (teamsToInsert.length === 0) {
      return res.status(400).json({ error: 'No valid participant names found' });
    }

    await db.query('BEGIN');
    const insertedTeams = [];
    for (const teamName of teamsToInsert) {
      // Check if team name already exists in this tournament to avoid duplicates
      const dup = await db.query('SELECT id FROM teams WHERE tournament_id=$1 AND name=$2', [tournamentId, teamName]);
      if (dup.rows[0]) continue;

      const teamres = await db.query(
        'INSERT INTO teams(tournament_id, name) VALUES($1, $2) RETURNING *',
        [tournamentId, teamName]
      );
      insertedTeams.push(teamres.rows[0]);
    }

    await db.query('COMMIT');
    res.json({
      success: true,
      message: `Successfully registered ${insertedTeams.length} new teams to the tournament`,
      teams: insertedTeams
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Import to existing tournament error:', err);
    res.status(500).json({ error: 'Could not add participants to the tournament' });
  }
});

// Create a tournament (admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  try {
    const result = await db.query('INSERT INTO tournaments(name, registration_open) VALUES($1, true) RETURNING *', [name]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create tournament' });
  }
});

// Register logged-in user to a tournament
router.post('/:id/register', authenticateToken, requireRole(['user', 'admin']), async (req, res) => {
  const tournamentId = req.params.id;
  const { name } = req.body;
  try {
    const tournamentRes = await db.query('SELECT id, registration_open FROM tournaments WHERE id=$1', [tournamentId]);
    const tournament = tournamentRes.rows[0];
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (!tournament.registration_open) return res.status(400).json({ error: 'Registrations are closed' });

    const existing = await db.query('SELECT id FROM teams WHERE tournament_id=$1 AND user_id=$2', [tournamentId, req.user.id]);
    if (existing.rows[0]) return res.status(400).json({ error: 'Already registered' });

    const result = await db.query(
      'INSERT INTO teams(tournament_id, name, user_id) VALUES($1,$2,$3) RETURNING *',
      [tournamentId, name || req.user.username, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not register team' });
  }
});

async function getMatchOverlayPayload(matchId) {
  const result = await db.query(
    'SELECT m.*, t1.name as team1_name, t2.name as team2_name FROM matches m LEFT JOIN teams t1 ON m.team1_id=t1.id LEFT JOIN teams t2 ON m.team2_id=t2.id WHERE m.id=$1',
    [matchId]
  );
  const match = result.rows[0];
  if (!match) return null;

  return {
    matchId: match.id,
    team1: match.team1_name || 'TBD',
    team2: match.team2_name || 'TBD',
    score1: match.score1,
    score2: match.score2,
    status: match.status,
    winner_team_id: match.winner_team_id
  };
}

async function broadcastMatchUpdate(matchId, juez = null) {
  try {
    const payload = await getMatchOverlayPayload(matchId);
    if (!payload || !global.overlayNamespace) return;

    // If a judge username is provided, include it in the payload so overlays/streams can show who made the update
    if (juez) payload.lastUpdatedBy = String(juez);

    if (global.broadcastOverlayState) {
      global.broadcastOverlayState(payload);
    } else {
      global.overlayNamespace.emit('overlayUpdate', payload);
    }
  } catch (err) {
    console.error('Error broadcasting match update:', err);
  }
}

async function clearOverlayChannel(channel) {
  const payload = {
    matchId: null,
    team1: '',
    team2: '',
    score1: 0,
    score2: 0,
    status: 'empty',
    winner_team_id: null,
    channel: String(channel)
  };

  if (!global.currentOverlayStates) {
    global.currentOverlayStates = {};
  }
  global.currentOverlayStates[String(channel)] = payload;
  if (global.overlayNamespace) {
    global.overlayNamespace.to(`channel_${channel}`).emit('overlayUpdate', payload);
  }
}

async function getJudgeOverlayAssignment(tournamentId, judgeUserId) {
  const result = await db.query(
    'SELECT overlay_channel FROM judge_overlay_assignments WHERE tournament_id=$1 AND judge_user_id=$2',
    [tournamentId, judgeUserId]
  );
  return result.rows[0] || null;
}

// Helper to finalize a match and advance the winner to the next round
async function finalizeAndAdvanceMatch(matchId, winnerId) {
  // 1. Update the match status and winner in the database
  const res = await db.query(
    'UPDATE matches SET status=$1, winner_team_id=$2 WHERE id=$3 RETURNING *',
    ['finished', winnerId, matchId]
  );
  const match = res.rows[0];
  if (!match) return null;

  const { tournament_id, round } = match;

  // 2. Broadcast the update for the finished match
  await broadcastMatchUpdate(matchId);

  // 3. If the current round is fully completed, generate the next round from
  // the actual winners. This avoids chaining byes through placeholder slots.
  await maybeGenerateNextRound(tournament_id, round);

  return match;
}

async function maybeGenerateNextRound(tournamentId, currentRound) {
  const currentMatchesRes = await db.query(
    'SELECT id, team1_id, team2_id, status, winner_team_id FROM matches WHERE tournament_id=$1 AND round=$2 ORDER BY slot, id',
    [tournamentId, currentRound]
  );

  const currentMatches = currentMatchesRes.rows;
  if (currentMatches.length === 0) return null;
  if (currentMatches.some(match => match.status !== 'finished')) return null;

  if (isTriangularRound(currentMatches)) return null;

  const nextRound = currentRound + 1;
  const nextRoundExists = await db.query(
    'SELECT id FROM matches WHERE tournament_id=$1 AND round=$2 LIMIT 1',
    [tournamentId, nextRound]
  );
  if (nextRoundExists.rows.length > 0) return nextRound;

  const winners = currentMatches
    .filter(match => match.winner_team_id)
    .map(match => ({
      teamId: match.winner_team_id,
      cameFromBye: !match.team1_id || !match.team2_id,
    }));

  if (winners.length < 2) return null;

  if (winners.length === 3) {
    await createTriangularRound(tournamentId, nextRound, winners.map(winner => winner.teamId));
    return nextRound;
  }

  winners.sort((a, b) => Number(b.cameFromBye) - Number(a.cameFromBye));

  await db.query('BEGIN');
  try {
    let slot = 1;
    for (let index = 0; index < winners.length; index += 2) {
      const first = winners[index];
      const second = winners[index + 1];

      if (second) {
        await db.query(
          'INSERT INTO matches(tournament_id, round, slot, team1_id, team2_id, status) VALUES($1,$2,$3,$4,$5,$6)',
          [tournamentId, nextRound, slot, first.teamId, second.teamId, 'pending']
        );
      } else {
        await db.query(
          'INSERT INTO matches(tournament_id, round, slot, team1_id, team2_id, status, winner_team_id) VALUES($1,$2,$3,$4,$5,$6,$7)',
          [tournamentId, nextRound, slot, first.teamId, null, 'finished', first.teamId]
        );
      }

      slot++;
    }

    await db.query('COMMIT');
    return nextRound;
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }
}

function isTriangularRound(matches) {
  if (matches.length !== 3) return false;

  const participants = [];
  for (const match of matches) {
    if (!match.team1_id || !match.team2_id) return false;
    participants.push(match.team1_id, match.team2_id);
  }

  const counts = new Map();
  for (const teamId of participants) {
    counts.set(teamId, (counts.get(teamId) || 0) + 1);
  }

  if (counts.size !== 3) return false;
  return Array.from(counts.values()).every(count => count === 2);
}

async function createTriangularRound(tournamentId, round, teamIds) {
  if (!Array.isArray(teamIds) || teamIds.length !== 3) return;

  await db.query('BEGIN');
  try {
    await db.query(
      'INSERT INTO matches(tournament_id, round, slot, team1_id, team2_id, status) VALUES($1,$2,$3,$4,$5,$6)',
      [tournamentId, round, 1, teamIds[0], teamIds[1], 'pending']
    );
    await db.query(
      'INSERT INTO matches(tournament_id, round, slot, team1_id, team2_id, status) VALUES($1,$2,$3,$4,$5,$6)',
      [tournamentId, round, 2, teamIds[1], teamIds[2], 'pending']
    );
    await db.query(
      'INSERT INTO matches(tournament_id, round, slot, team1_id, team2_id, status) VALUES($1,$2,$3,$4,$5,$6)',
      [tournamentId, round, 3, teamIds[0], teamIds[2], 'pending']
    );
    await db.query('COMMIT');
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }
}

function buildPodium(teamRows, matches) {
  const stats = new Map();

  for (const team of teamRows) {
    stats.set(team.id, {
      id: team.id,
      name: team.name,
      wins: 0,
      losses: 0,
      scoreFor: 0,
      scoreAgainst: 0,
      highestRound: 0,
    });
  }

  for (const match of matches) {
    if (match.status !== 'finished') continue;

    const team1 = match.team1_id ? stats.get(match.team1_id) : null;
    const team2 = match.team2_id ? stats.get(match.team2_id) : null;

    if (team1) {
      team1.highestRound = Math.max(team1.highestRound, match.round);
      team1.scoreFor += Number(match.score1 || 0);
      team1.scoreAgainst += Number(match.score2 || 0);
    }

    if (team2) {
      team2.highestRound = Math.max(team2.highestRound, match.round);
      team2.scoreFor += Number(match.score2 || 0);
      team2.scoreAgainst += Number(match.score1 || 0);
    }

    if (match.winner_team_id) {
      const winner = stats.get(match.winner_team_id);
      if (winner) winner.wins += 1;

      const loserId = match.team1_id === match.winner_team_id ? match.team2_id : match.team1_id;
      const loser = loserId ? stats.get(loserId) : null;
      if (loser) loser.losses += 1;
    }
  }

  const ranked = Array.from(stats.values()).sort((a, b) => {
    const scoreDiffA = a.scoreFor - a.scoreAgainst;
    const scoreDiffB = b.scoreFor - b.scoreAgainst;

    return (
      b.highestRound - a.highestRound ||
      b.wins - a.wins ||
      scoreDiffB - scoreDiffA ||
      b.scoreFor - a.scoreFor ||
      a.name.localeCompare(b.name, 'es')
    );
  });

  return ranked.slice(0, 3).map((team, index) => ({
    position: index + 1,
    ...team,
    scoreDiff: team.scoreFor - team.scoreAgainst,
  }));
}

// Generate a bracket that switches to a triangular round when 3 teams remain
router.post('/:id/generate-bracket', authenticateToken, requireRole(['admin']), async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const teamsRes = await db.query('SELECT id FROM teams WHERE tournament_id=$1 ORDER BY id', [tournamentId]);
    const teamIds = teamsRes.rows.map(r => r.id);
    const N = teamIds.length;

    if (N < 2) return res.status(400).json({ error: 'Need at least 2 teams' });

    // Clear existing matches for tournament
    await db.query('DELETE FROM matches WHERE tournament_id=$1', [tournamentId]);
    await db.query('UPDATE tournaments SET registration_open=false WHERE id=$1', [tournamentId]);

    if (N === 3) {
      await createTriangularRound(tournamentId, 1, teamIds);
      const allMatchesRes = await db.query(
        'SELECT m.*, t1.name as team1_name, t2.name as team2_name FROM matches m LEFT JOIN teams t1 ON m.team1_id=t1.id LEFT JOIN teams t2 ON m.team2_id=t2.id WHERE m.tournament_id=$1 ORDER BY m.round, m.slot',
        [tournamentId]
      );
      return res.json({ matches: allMatchesRes.rows });
    }

    await db.query('BEGIN');

    // Create only the real first-round matches.
    let slot = 1;
    for (let index = 0; index < N; index += 2) {
      const team1 = teamIds[index];
      const team2 = teamIds[index + 1] || null;

      if (team2) {
        await db.query(
          'INSERT INTO matches(tournament_id, round, slot, team1_id, team2_id, status) VALUES($1,$2,$3,$4,$5,$6)',
          [tournamentId, 1, slot, team1, team2, 'pending']
        );
      } else {
        await db.query(
          'INSERT INTO matches(tournament_id, round, slot, team1_id, team2_id, status, winner_team_id) VALUES($1,$2,$3,$4,$5,$6,$7)',
          [tournamentId, 1, slot, team1, null, 'finished', team1]
        );
      }

      slot++;
    }

    await db.query('COMMIT');

    // Fetch all created matches for this tournament to return (joining with team names)
    const allMatchesRes = await db.query(
      'SELECT m.*, t1.name as team1_name, t2.name as team2_name FROM matches m LEFT JOIN teams t1 ON m.team1_id=t1.id LEFT JOIN teams t2 ON m.team2_id=t2.id WHERE m.tournament_id=$1 ORDER BY m.round, m.slot',
      [tournamentId]
    );

    res.json({ matches: allMatchesRes.rows });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Could not generate bracket' });
  }
});

// Toggle/update tournament registration status (admin only, only if no brackets generated)
router.patch('/:id/registration', authenticateToken, requireRole(['admin']), async (req, res) => {
  const tournamentId = req.params.id;
  const { open } = req.body;
  if (typeof open !== 'boolean') return res.status(400).json({ error: 'Missing or invalid open status' });

  try {
    // Check if matches/brackets already exist
    const matchCheck = await db.query('SELECT COUNT(*)::int AS count FROM matches WHERE tournament_id=$1', [tournamentId]);
    if (matchCheck.rows[0].count > 0) {
      return res.status(400).json({ error: 'Cannot change registration status once bracket is generated' });
    }

    const result = await db.query(
      'UPDATE tournaments SET registration_open=$1 WHERE id=$2 RETURNING *',
      [open, tournamentId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Tournament not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update registration status' });
  }
});

// List matches for a tournament
router.get('/:id/matches', async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const result = await db.query('SELECT m.*, t1.name as team1_name, t2.name as team2_name FROM matches m LEFT JOIN teams t1 ON m.team1_id=t1.id LEFT JOIN teams t2 ON m.team2_id=t2.id WHERE m.tournament_id=$1 ORDER BY m.round, m.slot', [tournamentId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not list matches' });
  }
});

// Get the final podium for a finished tournament
router.get('/:id/podium', async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const teamRowsRes = await db.query('SELECT id, name FROM teams WHERE tournament_id=$1 ORDER BY id', [tournamentId]);
    const matchesRes = await db.query(
      'SELECT id, round, slot, team1_id, team2_id, score1, score2, status, winner_team_id FROM matches WHERE tournament_id=$1 ORDER BY round, slot, id',
      [tournamentId]
    );

    const matches = matchesRes.rows;
    const finished = matches.length > 0 && matches.every(match => match.status === 'finished');

    if (!finished) {
      return res.json({ finished: false, podium: [] });
    }

    const podium = buildPodium(teamRowsRes.rows, matches);
    res.json({ finished: true, podium });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not build podium' });
  }
});

// Read OverlayW visibility toggle for a tournament (public read for overlay clients)
router.get('/:id/overlayw-visibility', async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const result = await db.query(
      'SELECT overlayw_enabled FROM tournament_overlay_settings WHERE tournament_id=$1',
      [tournamentId]
    );
    const enabled = result.rows[0]?.overlayw_enabled === true;
    res.json({ enabled });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load OverlayW visibility' });
  }
});

// Toggle OverlayW visibility for a tournament
router.post('/:id/overlayw-visibility', authenticateToken, requireRole(['admin', 'stream']), async (req, res) => {
  const tournamentId = req.params.id;
  const { enabled } = req.body;

  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'Missing or invalid enabled flag' });
  }

  try {
    const exists = await db.query('SELECT id FROM tournaments WHERE id=$1', [tournamentId]);
    if (!exists.rows[0]) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const result = await db.query(
      `INSERT INTO tournament_overlay_settings(tournament_id, overlayw_enabled, updated_at)
       VALUES($1,$2,NOW())
       ON CONFLICT (tournament_id)
       DO UPDATE SET overlayw_enabled = EXCLUDED.overlayw_enabled, updated_at = NOW()
       RETURNING overlayw_enabled`,
      [tournamentId, enabled]
    );

    res.json({ enabled: result.rows[0].overlayw_enabled === true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update OverlayW visibility' });
  }
});

// List judges and their overlay assignments for a tournament
router.get('/:id/overlay-assignments', authenticateToken, requireRole(['admin', 'stream']), async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const result = await db.query(
      `SELECT
        u.id AS judge_user_id,
        u.username,
        a.overlay_channel,
        c.match_id,
        c.updated_at AS claim_updated_at,
        m.round,
        m.slot,
        t1.name AS team1_name,
        t2.name AS team2_name
      FROM users u
      LEFT JOIN judge_overlay_assignments a
        ON a.tournament_id = $1 AND a.judge_user_id = u.id
      LEFT JOIN judge_match_claims c
        ON c.tournament_id = $1 AND c.judge_user_id = u.id
      LEFT JOIN matches m ON m.id = c.match_id
      LEFT JOIN teams t1 ON t1.id = m.team1_id
      LEFT JOIN teams t2 ON t2.id = m.team2_id
      WHERE u.role = 'juez'
      ORDER BY u.username`,
      [tournamentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load overlay assignments' });
  }
});

// Assign or unassign a judge to an overlay channel for a tournament
router.post('/:id/overlay-assignments', authenticateToken, requireRole(['admin', 'stream']), async (req, res) => {
  const tournamentId = req.params.id;
  const { judgeUserId, overlayChannel } = req.body;
  const channelValue = overlayChannel === '' || overlayChannel === null || typeof overlayChannel === 'undefined'
    ? null
    : Number(overlayChannel);

  if (!judgeUserId) {
    return res.status(400).json({ error: 'Missing judgeUserId' });
  }
  if (channelValue !== null && (!Number.isInteger(channelValue) || channelValue < 1 || channelValue > 4)) {
    return res.status(400).json({ error: 'Invalid overlayChannel' });
  }

  try {
    const judgeRes = await db.query('SELECT id FROM users WHERE id=$1 AND role=$2', [judgeUserId, 'juez']);
    if (!judgeRes.rows[0]) {
      return res.status(404).json({ error: 'Judge not found' });
    }

    if (channelValue !== null) {
      const taken = await db.query(
        'SELECT judge_user_id FROM judge_overlay_assignments WHERE tournament_id=$1 AND overlay_channel=$2 AND judge_user_id<>$3',
        [tournamentId, channelValue, judgeUserId]
      );
      if (taken.rows[0]) {
        return res.status(409).json({ error: 'That overlay is already assigned to another judge' });
      }
    }

    const previous = await db.query(
      'SELECT overlay_channel FROM judge_overlay_assignments WHERE tournament_id=$1 AND judge_user_id=$2',
      [tournamentId, judgeUserId]
    );
    const previousChannel = previous.rows[0]?.overlay_channel ?? null;

    await db.query(
      `INSERT INTO judge_overlay_assignments(tournament_id, judge_user_id, overlay_channel, updated_at)
       VALUES($1,$2,$3,NOW())
       ON CONFLICT (tournament_id, judge_user_id)
       DO UPDATE SET overlay_channel = EXCLUDED.overlay_channel, updated_at = NOW()` ,
      [tournamentId, judgeUserId, channelValue]
    );

    if (previousChannel !== null && Number(previousChannel) !== Number(channelValue)) {
      await clearOverlayChannel(previousChannel);
    }

    const current = await db.query(
      `SELECT u.id AS judge_user_id, u.username, a.overlay_channel
       FROM users u
       LEFT JOIN judge_overlay_assignments a
         ON a.tournament_id = $1 AND a.judge_user_id = u.id
       WHERE u.id = $2 AND u.role = 'juez'`,
      [tournamentId, judgeUserId]
    );

    res.json(current.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save overlay assignment' });
  }
});

// Reserve a match for the judge that opened Semaforo.
// If the judge has an assigned overlay, the match is pushed there immediately.
router.post('/:id/match/:matchId/claim-overlay', authenticateToken, requireRole(['admin', 'juez']), async (req, res) => {
  const tournamentId = req.params.id;
  const matchId = req.params.matchId;

  try {
    const matchRes = await db.query('SELECT id, tournament_id FROM matches WHERE id=$1 AND tournament_id=$2', [matchId, tournamentId]);
    const match = matchRes.rows[0];
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const assignment = await getJudgeOverlayAssignment(tournamentId, req.user.id);
    const overlayChannel = assignment?.overlay_channel ?? null;

    await db.query('BEGIN');
    try {
      const claimedByOther = await db.query(
        'SELECT judge_user_id FROM judge_match_claims WHERE match_id=$1 AND judge_user_id<>$2',
        [matchId, req.user.id]
      );
      if (claimedByOther.rows[0]) {
        await db.query('ROLLBACK');
        return res.status(409).json({ error: 'This match is already open by another judge' });
      }

      await db.query('DELETE FROM judge_match_claims WHERE judge_user_id=$1', [req.user.id]);
      await db.query(
        `INSERT INTO judge_match_claims(tournament_id, match_id, judge_user_id, overlay_channel, updated_at)
         VALUES($1,$2,$3,$4,NOW())
         ON CONFLICT (judge_user_id)
         DO UPDATE SET tournament_id = EXCLUDED.tournament_id,
                       match_id = EXCLUDED.match_id,
                       overlay_channel = EXCLUDED.overlay_channel,
                       updated_at = NOW()`,
        [tournamentId, matchId, req.user.id, overlayChannel]
      );

      await db.query('COMMIT');
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }

    const payload = await getMatchOverlayPayload(matchId);
    if (payload) {
      // Attach who claimed/opened the match so the stream overlay can switch to the judge's channel
      payload.claimedBy = req.user.username;
      payload.claimedById = req.user.id;
      payload.channel = overlayChannel ? String(overlayChannel) : undefined;

      if (payload && overlayChannel && global.broadcastOverlayState) {
        global.broadcastOverlayState(payload, overlayChannel);
      } else if (payload && overlayChannel && global.overlayNamespace) {
        global.overlayNamespace.to(`channel_${overlayChannel}`).emit('overlayUpdate', payload);
      }
    }

    res.json({ ok: true, matchId: Number(matchId), overlayChannel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not claim match for overlay' });
  }
});

// Increment score for a match (team = 1 or 2)
router.post('/match/:matchId/increment', authenticateToken, requireRole(['admin', 'stream', 'juez']), async (req, res) => {
  const matchId = req.params.matchId;
  const { team } = req.body;
  if (![1,2].includes(team)) return res.status(400).json({ error: 'Invalid team' });
  try {
    const field = team === 1 ? 'score1' : 'score2';
    const update = await db.query(`UPDATE matches SET ${field} = ${field} + 1 WHERE id=$1 RETURNING *`, [matchId]);
    let match = update.rows[0];

    // Auto-finalize if a team reaches 2 points (Best of 3 victory)
    if (match.score1 >= 2 || match.score2 >= 2) {
      const winnerId = match.score1 >= 2 ? match.team1_id : match.team2_id;
      match = await finalizeAndAdvanceMatch(matchId, winnerId);
    } else {
      // If the request included a judge identity, pass it through so overlays include who made the change
      const juez = req.body?.juez || null;
      await broadcastMatchUpdate(matchId, juez);
    }

    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not increment score' });
  }
});

// Finalize a match (determine winner)
router.post('/match/:matchId/finalize', authenticateToken, requireRole(['admin', 'stream', 'juez']), async (req, res) => {
  const matchId = req.params.matchId;
  try {
    const mres = await db.query('SELECT * FROM matches WHERE id=$1', [matchId]);
    const match = mres.rows[0];
    if (!match) return res.status(404).json({ error: 'Match not found' });
    let winner = null;
    if (match.score1 > match.score2) winner = match.team1_id;
    else if (match.score2 > match.score1) winner = match.team2_id;
    
    const updatedMatch = await finalizeAndAdvanceMatch(matchId, winner);

    res.json({ ok: true, winner, match: updatedMatch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not finalize match' });
  }
});

// Get a single match with team names (admin, stream, juez only)
router.get('/match/:matchId', authenticateToken, requireRole(['admin', 'stream', 'juez']), async (req, res) => {
  const matchId = req.params.matchId;
  try {
    const result = await db.query(
      'SELECT m.*, t1.name as team1_name, t2.name as team2_name FROM matches m LEFT JOIN teams t1 ON m.team1_id=t1.id LEFT JOIN teams t2 ON m.team2_id=t2.id WHERE m.id=$1',
      [matchId]
    );
    const match = result.rows[0];
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load match' });
  }
});

// Reset match scores to 0 (admin, juez only)
router.post('/match/:matchId/reset', authenticateToken, requireRole(['admin', 'juez']), async (req, res) => {
  const matchId = req.params.matchId;
  try {
    const result = await db.query(
      'UPDATE matches SET score1=0, score2=0 WHERE id=$1 RETURNING *',
      [matchId]
    );
    const match = result.rows[0];
    if (!match) return res.status(404).json({ error: 'Match not found' });

    // fetch team names for overlay
    const t1 = match.team1_id ? (await db.query('SELECT name FROM teams WHERE id=$1', [match.team1_id])).rows[0]?.name : null;
    const t2 = match.team2_id ? (await db.query('SELECT name FROM teams WHERE id=$1', [match.team2_id])).rows[0]?.name : null;

    // emit overlay update with names
    if (global.overlayNamespace) {
      const payload = {
        matchId: match.id,
        team1: t1 || 'TBD',
        team2: t2 || 'TBD',
        score1: 0,
        score2: 0,
        status: match.status,
        winner_team_id: match.winner_team_id
      };
      if (global.broadcastOverlayState) {
        global.broadcastOverlayState(payload);
      } else {
        global.overlayNamespace.emit('overlayUpdate', payload);
      }
    }

    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reset match' });
  }
});

module.exports = router;
