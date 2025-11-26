import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

interface BoardDetail {
  slug: string
  name: string
  description: string
  category: string
  mainImage: string
  fullDescription: string
  specifications: Array<{ label: string; value: string }>
  features: string[]
  applications: string[]
  gallery: string[]
}

const boardsData: Record<string, BoardDetail> = {
  'hunter-controller': {
    slug: 'hunter-controller',
    name: 'Hunter Controller',
    description: 'Placa de control principal para robots de competición',
    category: 'Control',
    mainImage: '/images/default.jpg',
    fullDescription: `La Hunter Controller es la placa de control central diseñada para robots de competición de alto rendimiento. 
    Ofrece capacidades avanzadas de procesamiento, control PWM de precisión y conectividad expandida.`,
    specifications: [
      { label: 'Procesador', value: 'ARM Cortex-M4 @ 168MHz' },
      { label: 'Memoria RAM', value: '192 KB' },
      { label: 'Flash', value: '1 MB' },
      { label: 'Canales PWM', value: '16 (16-bit)' },
      { label: 'ADC', value: '12-bit, 2.4 MSPS' },
      { label: 'Interfaces', value: 'I2C, SPI, UART, CAN' },
      { label: 'Alimentación', value: '5V (regulada)' },
      { label: 'Tamaño', value: '50mm × 40mm' },
    ],
    features: [
      'ARM Cortex-M4 @ 168MHz',
      'PWM avanzado de 16 canales',
      'CAN Bus integrado',
      'Protección de sobrecorriente',
      'LED indicadores de estado',
      'Conector de depuración SWD',
      'Bootloader actualizable',
    ],
    applications: [
      'Robots de competición Sumo',
      'Sistemas de seguimiento de línea',
      'Robots manipuladores',
      'Plataformas de movimiento autónomo',
    ],
    gallery: ['/images/default.jpg'],
  },
  'sensor-hub': {
    slug: 'sensor-hub',
    name: 'Sensor Hub',
    description: 'Centro de gestión de sensores',
    category: 'Sensores',
    mainImage: '/images/default.jpg',
    fullDescription: `Sensor Hub es la placa de integración para múltiples sensores. Proporciona interfaz I2C/SPI y fusión de datos IMU.`,
    specifications: [
      { label: 'Entradas Analógicas', value: '8 × 12-bit' },
      { label: 'Interfaces Digitales', value: 'I2C, SPI' },
      { label: 'IMU', value: '6-DOF (Acelerómetro + Giroscopio)' },
      { label: 'Rango de Voltaje', value: '3.3V - 5V' },
      { label: 'Consumo', value: '< 50mA idle' },
      { label: 'Tamaño', value: '40mm × 30mm' },
    ],
    features: [
      'I2C/SPI configurable',
      '8 canales analógicos',
      'Fusión IMU',
      'Calibración automática',
      'Filtros digitales',
      'LED de diagnóstico',
    ],
    applications: [
      'Sensores de distancia ultrasónicos',
      'Sensores de color y luz',
      'Sensores de temperatura',
      'Acelerómetros y giroscopios',
    ],
    gallery: ['/images/default.jpg'],
  },
  'power-manager': {
    slug: 'power-manager',
    name: 'Power Manager',
    description: 'Gestión de energía',
    category: 'Energía',
    mainImage: '/images/default.jpg',
    fullDescription: `Power Manager maneja inteligentemente la distribución de energía, protección de batería y monitoreo en tiempo real.`,
    specifications: [
      { label: 'Rango de Batería', value: '3S-5S LiPo' },
      { label: 'Corriente Máxima', value: '60A continua' },
      { label: 'BEC Salida', value: '5V/3A regulada' },
      { label: 'Protección', value: 'Sobrecorriente, Sobretensión' },
      { label: 'Monitoreo', value: 'Voltaje y Corriente en tiempo real' },
      { label: 'Balanceo', value: 'Automático' },
      { label: 'Tamaño', value: '60mm × 45mm' },
    ],
    features: [
      '3-5S LiPo compatible',
      'Protección BEC regulada',
      'Monitoreo en tiempo real',
      'Balanceo automático',
      'Protección contra cortocircuito',
      'Indicadores LED de carga',
    ],
    applications: [
      'Distribución de energía en robots',
      'Gestión de baterías LiPo',
      'Sistemas de respaldo de energía',
    ],
    gallery: ['/images/default.jpg'],
  },
}

interface Params {
  slug: string
}

export async function getStaticPaths() {
  const paths = Object.keys(boardsData).map(slug => ({
    params: { slug },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }: { params: Params }) {
  const board = boardsData[params.slug]
  if (!board) return { notFound: true }
  return { props: { board }, revalidate: 3600 }
}

export default function BoardDetailPage({ board }: { board: BoardDetail }) {
  return (
    <>
      <Head>
        <title>{board.name} — XpriT Robotics</title>
        <meta name="description" content={board.description} />
      </Head>

      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/boards" className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block">
            ← Volver a placas
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-5xl font-bold text-cyan-300">{board.name}</h1>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-semibold">
                {board.category}
              </span>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl">{board.fullDescription}</p>
          </div>

          {/* Imagen principal */}
          {board.mainImage && (
            <div className="w-full h-96 bg-gray-700 rounded-lg mb-12 relative overflow-hidden">
              <Image
                src={board.mainImage}
                alt={board.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Características */}
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold mb-6 text-cyan-300">Características</h2>
              <ul className="space-y-3">
                {board.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-300">
                    <span className="text-cyan-400 flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Especificaciones técnicas */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 text-cyan-300">Especificaciones Técnicas</h2>
              <div className="grid grid-cols-2 gap-4">
                {board.specifications.map((spec, idx) => (
                  <div key={idx} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">{spec.label}</p>
                    <p className="text-cyan-300 font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Aplicaciones */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Aplicaciones</h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {board.applications.map((app, idx) => (
                <li key={idx} className="flex gap-3 text-gray-300">
                  <span className="text-cyan-400 flex-shrink-0">→</span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center p-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-500/20">
            <h3 className="text-2xl font-bold mb-4 text-cyan-300">¿Interesado en esta placa?</h3>
            <p className="text-gray-300 mb-6">
              Obtén más información sobre disponibilidad, precios y opciones de integración.
            </p>
            <Link href="/contacto" className="inline-block px-8 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
              Contactar
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
