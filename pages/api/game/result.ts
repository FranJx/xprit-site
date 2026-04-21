import type { NextApiRequest, NextApiResponse } from 'next';
import { saveGameResult, getUserStats } from '@/lib/game/gameUtils';

interface ResponseData {
  success: boolean;
  result?: any;
  stats?: any;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method === 'POST') {
      const { userId, attempts } = req.body;

      if (!userId || attempts === undefined) {
        return res.status(400).json({
          success: false,
          message: 'userId y attempts son requeridos',
        });
      }

      if (attempts > 15) {
        return res.status(400).json({
          success: false,
          message: 'Se excedió el límite de 15 intentos',
        });
      }

      const result = await saveGameResult(userId, attempts, true);
      const stats = await getUserStats(userId);

      return res.status(200).json({
        success: true,
        result,
        stats,
      });
    }

    res.status(405).json({
      success: false,
      message: 'Método no permitido',
    });
  } catch (error) {
    console.error('Error en API de resultado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}
