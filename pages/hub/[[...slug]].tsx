import Head from 'next/head'

export default function HubPage() {
  return (
    <>
      <Head>
        <title>XTH — XpriT Robotics Hub</title>
        <meta name="description" content="XTH - Red Social de Robótica" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Cargar estilos del XTH si existen */}
        <link rel="stylesheet" href="/hub/style.css" />
        <link rel="stylesheet" href="/hub/index.css" />
      </Head>

      {/* Contenedor root para el XTH */}
      <div id="root" style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}></div>

      {/* Cargar el bundle principal del XTH */}
      <script type="module" src="/hub/index.js" async></script>
    </>
  )
}

