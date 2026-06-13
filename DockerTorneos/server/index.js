require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const db = require('./db');
const authRoutes = require('./routes/auth');
const tournamentRoutes = require('./routes/tournaments');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);

app.get('/api/ping', (req, res) => res.json({ ok: true }));

// Status endpoint: checks DB connectivity
app.get('/api/status', async (req, res) => {
  const db = require('./db');
  try {
    await db.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    console.error('DB status error', err.message || err);
    res.status(500).json({ ok: false, db: 'error', message: err.message || String(err) });
  }
});

// Serve static client files (React built SPA) in production
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

function broadcastOverlayState(payload, channel) {
  if (!global.currentOverlayStates) {
    global.currentOverlayStates = {};
  }
  
  if (channel) {
    const updatedPayload = { ...payload, channel: String(channel) };
    global.currentOverlayStates[String(channel)] = updatedPayload;
    overlayNamespace.to(`channel_${channel}`).emit('overlayUpdate', updatedPayload);
  } else {
    // Find which channels are displaying this match
    let found = false;
    for (const ch in global.currentOverlayStates) {
      if (global.currentOverlayStates[ch] && String(global.currentOverlayStates[ch].matchId) === String(payload.matchId)) {
        const updatedPayload = { ...global.currentOverlayStates[ch], ...payload, channel: String(ch) };
        global.currentOverlayStates[ch] = updatedPayload;
        overlayNamespace.to(`channel_${ch}`).emit('overlayUpdate', updatedPayload);
        found = true;
      }
    }
    if (!found) return;
  }
}

// Simple namespace for overlay updates
const overlayNamespace = io.of('/overlay');

overlayNamespace.on('connection', socket => {
  const channel = socket.handshake.query.channel || '1';
  console.log(`Overlay socket connected to channel ${channel}, ID:`, socket.id);
  socket.join(`channel_${channel}`);

  if (global.currentOverlayStates && global.currentOverlayStates[String(channel)]) {
    socket.emit('overlayUpdate', global.currentOverlayStates[String(channel)]);
  }

  socket.on('joinMatch', matchId => {
    socket.join(String(matchId));
  });

  socket.on('joinChannel', channelId => {
    socket.join(`channel_${channelId}`);
    console.log(`Socket ${socket.id} joined channel_${channelId}`);
    if (global.currentOverlayStates && global.currentOverlayStates[String(channelId)]) {
      socket.emit('overlayUpdate', global.currentOverlayStates[String(channelId)]);
    }
  });

  socket.on('scoreUpdate', data => {
    const ch = data.channel || '1';
    broadcastOverlayState(data, ch);
  });

  socket.on('setMatch', data => {
    const ch = data.channel || '1';
    broadcastOverlayState(data, ch);
  });

  socket.on('disconnect', () => {});
});

// expose namespace globally for simple access from routes (prototype)
global.overlayNamespace = overlayNamespace;
global.broadcastOverlayState = broadcastOverlayState;

const PORT = process.env.PORT || 4000;

async function ensureOverlaySchema() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS judge_overlay_assignments (
      id SERIAL PRIMARY KEY,
      tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
      judge_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      overlay_channel INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (tournament_id, judge_user_id),
      UNIQUE (tournament_id, overlay_channel)
    );

    CREATE TABLE IF NOT EXISTS judge_match_claims (
      id SERIAL PRIMARY KEY,
      tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
      match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE UNIQUE,
      judge_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      overlay_channel INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tournament_overlay_settings (
      tournament_id INTEGER PRIMARY KEY REFERENCES tournaments(id) ON DELETE CASCADE,
      overlayw_enabled BOOLEAN NOT NULL DEFAULT false,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

.ensureOverlaySchema()
.then(() => {
    // Bind explicitly to 0.0.0.0 so the server is reachable from other machines on the LAN
    httpServer.listen(PORT, '0.0.0.0', () => console.log(`Server listening on ${PORT} (0.0.0.0)`));
  })
  .catch(err => {
    console.error('Failed to ensure overlay schema', err);
    process.exit(1);
  });
