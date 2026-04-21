import type { NextApiRequest, NextApiResponse } from 'next';
import { getGlobalRanking, getUserStats } from '@/lib/game/gameUtils';

interface ResponseData {
  success: boolean;
  ranking?: any[];
  userStats?: any;
  message?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method === 'GET') {
      const { userId } = req.query;

      const ranking = getGlobalRanking();
      
      let userStats;
      if (userId && typeof userId === 'string') {
        userStats = getUserStats(userId);
      }

      return res.status(200).json({
        success: true,
        ranking,
        userStats,
      });
    }

    res.status(405).json({
      success: false,
      message: 'Método no permitido',
    });
  } catch (error) {
    console.error('Error en API de ranking:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}
