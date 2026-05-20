export default function TorneosPage() {
  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src={process.env.NEXT_PUBLIC_TORNEOS_URL || 'http://localhost:4000'}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
        }}
        title="Torneos"
      />
    </div>
  );
}
