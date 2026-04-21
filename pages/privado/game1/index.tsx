import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Game1Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/privado/game1/juego');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-gray-400">Redirigiendo...</p>
    </div>
  );
}
