import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrCreateUser, updateUserName } from '@/lib/game/gameUtils';

interface ResponseData {
  success: boolean;
  user?: any;
  message?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method === 'GET') {
      // Obtener o crear usuario
      const { userId, name } = req.query;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'userId es requerido',
        });
      }

      const user = getOrCreateUser(userId, name as string | undefined);

      return res.status(200).json({
        success: true,
        user,
      });
    }

    if (req.method === 'POST') {
      // Actualizar nombre del usuario
      const { userId, name } = req.body;

      if (!userId || !name) {
        return res.status(400).json({
          success: false,
          message: 'userId y name son requeridos',
        });
      }

      const user = updateUserName(userId, name);

      return res.status(200).json({
        success: true,
        user,
      });
    }

    res.status(405).json({
      success: false,
      message: 'Método no permitido',
    });
  } catch (error) {
    console.error('Error en API de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}
