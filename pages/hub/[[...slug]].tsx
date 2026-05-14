import Head from 'next/head'

export default function HubPage() {
  return (
    <>
      <Head>
        <title>XTH — XpriT Robotics Hub</title>
        <meta name="description" content="XTH - Red Social de Robótica" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
        <iframe
          src="/hub/index.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0,
          }}
          title="XTH - XpriT Robotics Hub"
          allow="camera; microphone; clipboard-write; accelerometer; gyroscope"
        />
      </div>
    </>
  )
}

