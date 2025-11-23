import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface TeamUser {
  username: string;
  password: string;
  isAdmin?: boolean;
}

// Parse team users from environment variable (JSON format)
// Example: [{"username":"fran","password":"xxx","isAdmin":true},{"username":"miembro1","password":"yyy"}]
function getTeamUsers(): TeamUser[] {
  const usersJson = process.env.TEAM_USERS_JSON;
  if (!usersJson) {
    console.error('⚠️ TEAM_USERS_JSON environment variable not configured');
    return [];
  }
  try {
    return JSON.parse(usersJson);
  } catch (err) {
    console.error('❌ Failed to parse TEAM_USERS_JSON:', err);
    return [];
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'xprit-robotics-secret-key-2025-cambiar-en-produccion';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  const users = getTeamUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { username, role: 'team', isAdmin: user.isAdmin || false },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.status(200).json({ token, username, isAdmin: user.isAdmin || false });
}

