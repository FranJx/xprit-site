import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

interface SponsorPlan {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  image: string;
  priceUSD: number;
  minDuration: string;
  benefits: string[];
  color: string;
  bgGradient: string;
}

const sponsorPlans: SponsorPlan[] = [
  {
    id: 'silver',
    name: 'SILVER',
    subtitle: 'Apoyo inicial y visibilidad digital',
    icon: '⭐',
    image: '/images/sponsor-silver.svg',
    priceUSD: 50,
    minDuration: '3 meses',
    benefits: [
      'Logo en página web (sección sponsors - pequeño)',
      'Mención en redes sociales (1x/mes)',
      'Stickers con logo del sponsor',
      'Certificado digital de sponsorship',
      'Descuento 10% en servicios de consultoría'
    ],
    color: 'from-gray-400 to-gray-500',
    bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100'
  },
  {
    id: 'gold',
    name: 'GOLD',
    subtitle: 'Presencia destacada en eventos y redes',
    icon: '🏆',
    image: '/images/sponsor-gold.svg',
    priceUSD: 150,
    minDuration: '3 meses',
    benefits: [
      'Logo en página web (sección sponsors - medio)',
      'Menciones en redes sociales (2-3x/semana)',
      'Stickers y materiales con logo',
      'Mención en notas de prensa',
      'Descuento 15% en servicios de consultoría',
      'Mención en eventos y competiciones',
      'Remera del equipo con logo (branding personalizado)'
    ],
    color: 'from-yellow-400 to-yellow-500',
    bgGradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    subtitle: 'Colaboración estratégica y presencia física',
    icon: '💎',
    image: '/images/sponsor-platinum.svg',
    priceUSD: 300,
    minDuration: '6 meses',
    benefits: [
      'Logo prominente en página web (sección sponsors - grande)',
      'Menciones diarias en redes sociales + historias destacadas',
      'Página de sponsor personalizada (landing page)',
      'Logo en chasis de robots (1 robot mínimo)',
      'Mención principal en notas de prensa',
      'Video publicitario corto (30-60s)',
      'Bandera de sponsor en stand',
      'Parte del stand en competiciones',
      'Indumentaria del equipo con logo (camisa/gorro)',
      'Mención destacada en eventos y competiciones',
      'Descuento 25% en servicios de consultoría',
      'Reportes mensuales de alcance'
    ],
    color: 'from-blue-500 to-blue-600',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100'
  },
  {
    id: 'diamante',
    name: 'DIAMANTE',
    subtitle: 'Alianza principal y co-branding global',
    icon: '👑',
    image: '/images/sponsor-diamond.svg',
    priceUSD: 500,
    minDuration: '12 meses',
    benefits: [
      'Logo prominente en homepage de XpriT',
      'Mención prioritaria en redes sociales (múltiples posts/día)',
      'Página de sponsor personalizada + blog dedicado',
      'Logo en chasis de TODOS los robots del equipo',
      'Mención principal en todas las notas de prensa',
      'Video publicitario largo (2-3 min) + integración en contenidos',
      'Bandera principal en stand + área destacada',
      'Presencia prominente en competiciones nacionales',
      'Indumentaria completa del equipo con branding',
      'Robot con branding personalizado (posible co-diseño)',
      'Mención en comunicados de prensa (coautor)',
      'Reuniones estratégicas regulares',
      'Descuento 35% en servicios de consultoría',
      'Reportes mensuales detallados con estadísticas'
    ],
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'bg-gradient-to-br from-purple-50 to-pink-50'
  }
];

export default function Sponsors() {
  return (
    <>
      <Head>
        <title>Programa de Sponsors | XpriT Robotics</title>
        <meta name="description" content="Programa oficial de sponsorships 2025 - Apoya la robótica competitiva argentina y obtén visibilidad con beneficios tangibles." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Programa de Sponsors | XpriT Robotics" />
        <meta property="og:description" content="Sponsorea a XpriT Robotics - Alianzas estratégicas para empresas, instituciones y organismos." />
        <meta property="og:type" content="website" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Portada / Hero */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="mb-6">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Programa de Sponsors
              </h1>
              <p className="text-2xl text-gray-300 font-light mb-6">
                Robótica Competitiva Argentina 2025
              </p>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              Establece alianzas estratégicas con el equipo de robótica más destacado de Misiones
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Representantes en competencias internacionales: RoboChallenge (Rumania), RSM Challenge 2025 (Brasil), WRO 2023 (Panamá), Robotic People Fest (Colombia)
            </p>
          </div>
        </div>

        {/* Sección: Sobre XpriT Robotics */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mb-12">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6">Sobre XpriT Robotics</h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                XpriT Robotics es el equipo de robótica más destacado de la provincia de Misiones, con más de 100 podios provinciales y logros nacionales e internacionales.
              </p>
              <p>
                Ha representado a Argentina en competencias como <span className="text-cyan-400 font-semibold">RoboChallenge (Rumania)</span>, <span className="text-cyan-400 font-semibold">RSM Challenge 2025 (Brasil)</span>, <span className="text-cyan-400 font-semibold">WRO 2023 (Panamá)</span> y <span className="text-cyan-400 font-semibold">Robotic People Fest (Colombia)</span>, consolidándose como referente en innovación, educación tecnológica y robótica competitiva.
              </p>
              <p>
                Los fondos recaudados mediante este programa de sponsorship serán destinados exclusivamente al <span className="text-cyan-400 font-semibold">desarrollo tecnológico del equipo, viajes, insumos y mejoras en los robots</span>.
              </p>
              <p className="text-yellow-300 font-semibold">
                ✓ Ningún fondo será destinado a fines personales. Compromiso total con la transparencia.
              </p>
            </div>
          </div>
        </div>

        {/* Sección: Objetivo del Programa */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Objetivo del Programa</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              El Programa de Sponsorships de XpriT Robotics busca establecer alianzas estratégicas con empresas y organizaciones comprometidas con el desarrollo tecnológico argentino.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-lg mb-2">Impulso Tecnológico</h3>
              <p className="text-gray-400">Desarrollo de innovación nacional en robótica competitiva</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-bold text-lg mb-2">Educación Jóvenes</h3>
              <p className="text-gray-400">Formación de talentos en tecnología y competencia</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-bold text-lg mb-2">Visibilidad Global</h3>
              <p className="text-gray-400">Presencia en competencias internacionales</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="font-bold text-lg mb-2">Ecosistema Tech</h3>
              <p className="text-gray-400">Vinculación con comunidad tecnológica nacional</p>
            </div>
          </div>
        </div>

        {/* Planes de Sponsorship */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Planes de Sponsorship</h2>
            <p className="text-xl text-gray-400">Elige el nivel que mejor se adapte a tu organización</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorPlans.map((plan, index) => (
              <div key={plan.id} className="relative group">
                {/* Glow effect para Diamante */}
                {plan.id === 'diamante' && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                )}

                <div className={`relative ${plan.bgGradient} rounded-xl p-6 h-full border border-gray-700 hover:border-gray-500 transition transform hover:scale-105`}>
                  {/* Badge */}
                  {plan.id === 'diamante' && (
                    <div className="absolute -top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-bold text-white">
                      Recomendado
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-4">
                    <div className="text-4xl mb-2">{plan.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-700 font-semibold mb-3">{plan.subtitle}</p>
                  </div>

                  {/* Precio */}
                  <div className="mb-4 pb-4 border-b border-gray-300">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      USD ${plan.priceUSD}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Mínimo: {plan.minDuration}</div>
                  </div>

                  {/* Beneficios */}
                  <div className="mb-4">
                    <ul className="space-y-2">
                      {plan.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-xs text-gray-800">
                          <span className="text-green-600 mr-2 font-bold text-sm">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Extra info */}
                  <div className="text-xs text-gray-600 mb-4 pb-4 border-t border-gray-300 pt-4">
                    ✓ Certificado digital de colaboración incluido
                  </div>

                  {/* CTA Button */}
                  <a
                    href="mailto:info@xprit-robotics.com?subject=Interés en Plan de Sponsorship"
                    className={`block w-full text-center py-2 rounded-lg font-bold transition transform hover:scale-105 ${
                      plan.id === 'diamante'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                        : 'bg-gray-300 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Contactar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparativa */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Comparativa Detallada</h2>
          <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-200">Característica</th>
                  {sponsorPlans.map((plan) => (
                    <th key={plan.id} className="px-6 py-4 text-center font-bold text-gray-200">
                      <div className="text-3xl mb-2">{plan.icon}</div>
                      <div className="text-sm">{plan.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 font-semibold text-gray-200">Aporte Mensual</td>
                  {sponsorPlans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-gray-300">
                      USD ${plan.priceUSD}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 font-semibold text-gray-200">Duración Mínima</td>
                  {sponsorPlans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-gray-300">
                      {plan.minDuration}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 font-semibold text-gray-200">Menciones Redes</td>
                  {['1x/mes', '2-3x/mes', '1x/semana', '2x/semana'].map((item, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-gray-300">
                      {item}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 font-semibold text-gray-200">Landing Personalizada</td>
                  {[false, false, true, true].map((included, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-gray-300">
                      {included ? <span className="text-green-400 font-bold">✓</span> : <span className="text-gray-500">—</span>}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 font-semibold text-gray-200">Logo en Robots</td>
                  {[false, false, true, true].map((included, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-gray-300">
                      {included ? <span className="text-green-400 font-bold">✓</span> : <span className="text-gray-500">—</span>}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 font-semibold text-gray-200">Remera del Equipo</td>
                  {[false, true, true, true].map((included, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-gray-300">
                      {included ? <span className="text-green-400 font-bold">✓</span> : <span className="text-gray-500">—</span>}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 font-semibold text-gray-200">Video Publicitario</td>
                  {['No', 'No', '30-60s', '2-3min'].map((item, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-gray-300">
                      {item}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700 hover:bg-gray-750 transition">
                  <td className="px-6 py-4 font-semibold text-gray-200">Reportes Mensuales</td>
                  {[false, false, true, true].map((included, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-gray-300">
                      {included ? <span className="text-green-400 font-bold">✓</span> : <span className="text-gray-500">—</span>}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-750 transition">
                  <td className="px-6 py-4 font-semibold text-gray-200">Descuento Consultoría</td>
                  {['10%', '15%', '25%', '35%'].map((desc, idx) => (
                    <td key={idx} className="px-6 py-4 text-center font-semibold text-green-400">
                      {desc}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Proceso de Onboarding */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Proceso de Onboarding</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: '1', icon: '📝', title: 'Solicitud Inicial', desc: 'Contáctanos con interés' },
              { num: '2', icon: '✍️', title: 'Firma de Acuerdo', desc: 'Formalizamos alianza' },
              { num: '3', icon: '⚙️', title: 'Configuración', desc: 'Branding personalizado' },
              { num: '4', icon: '🚀', title: 'Activación', desc: 'Comienza visibilidad' },
              { num: '5', icon: '📊', title: 'Seguimiento', desc: 'Reportes regulares' }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-b from-blue-600 to-purple-600 rounded-lg p-6 text-center text-white">
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <div className="font-bold text-lg mb-1">{step.title}</div>
                  <div className="text-sm text-blue-100">{step.desc}</div>
                </div>
                {idx < 4 && (
                  <div className="hidden md:block absolute top-1/3 -right-2 text-2xl text-blue-500">→</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 mt-8 text-sm">
            Los sponsors de nivel Platinum y Diamante reciben reportes mensuales con estadísticas de alcance en redes, apariciones en medios y resultados de eventos.
          </p>
        </div>

        {/* Ejemplos de Visibilidad */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold mb-2 text-center">Ejemplos de Visibilidad</h2>
          <p className="text-center text-gray-400 mb-10">Visualiza cómo tu marca se vería con XpriT Robotics</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Remera */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition">
              <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">👕</div>
                  <p className="text-gray-400 text-sm">Logo en remera</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">Remera del Equipo</h3>
                <p className="text-sm text-gray-400">Visibilidad en competencias y eventos públicos</p>
              </div>
            </div>

            {/* Abrigo */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition">
              <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🧥</div>
                  <p className="text-gray-400 text-sm">Logo en abrigo</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">Abrigo Técnico</h3>
                <p className="text-sm text-gray-400">Identificación en eventos y viajes</p>
              </div>
            </div>

            {/* Cartelito */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition">
              <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">📋</div>
                  <p className="text-gray-400 text-sm">Cartelito robots</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">Cartelito de Robots</h3>
                <p className="text-sm text-gray-400">Promoción en redes y publicaciones</p>
              </div>
            </div>

            {/* Banderas */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition">
              <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🚩</div>
                  <p className="text-gray-400 text-sm">Banderas con logo</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">Banderas y Stand</h3>
                <p className="text-sm text-gray-400">Presencia en el sitio de competencias</p>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 mt-8 text-sm italic">
            ✨ Estas son mockups de ejemplo. Pronto agregaremos las imágenes reales de visualización.
          </p>
        </div>

        {/* Transparencia */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mb-12">
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">✓ Transparencia y Compromiso Ético</h2>
            <div className="space-y-4 text-gray-300">
              <p className="font-semibold text-yellow-300">Los aportes obtenidos mediante este programa serán destinados exclusivamente a:</p>
              <ul className="space-y-2 ml-6">
                <li>💻 Desarrollo y fabricación de robots de competencia</li>
                <li>🔧 Insumos, herramientas y materiales técnicos</li>
                <li>✈️ Traslados y participación en competencias nacionales e internacionales</li>
                <li>📹 Producción de contenido educativo y divulgativo</li>
              </ul>
              <p className="font-semibold text-yellow-300 mt-4">
                Ningún fondo será destinado a gastos personales.
              </p>
              <p className="text-sm mt-4 border-t border-yellow-500/30 pt-4">
                XpriT Robotics se compromete a mantener la transparencia y rendición de cuentas a cada sponsor de nivel Platinum o superior mediante reportes regulares con detalles de uso de fondos.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mb-12">
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12">
            <h2 className="text-3xl font-bold mb-4">¿Listo para apoyar la robótica argentina?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Contacta con nosotros para discutir el plan que mejor se adapta a tu organización
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@xprit-robotics.com?subject=Consulta Programa de Sponsorship"
                className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition transform hover:scale-105"
              >
                ✉️ Enviar Consulta
              </a>
              <a
                href="https://wa.me/+541234567890"
                className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition transform hover:scale-105"
              >
                💬 Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition">
              <h3 className="font-bold text-lg mb-4 text-cyan-400">📋 ¿Por qué Sponsorearnos?</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>✓ 100+ podios provinciales</li>
                <li>✓ Competencias internacionales</li>
                <li>✓ Equipo innovador y comprometido</li>
                <li>✓ ROI comprobado en visibilidad</li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition">
              <h3 className="font-bold text-lg mb-4 text-cyan-400">🎁 Servicios Adicionales</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>✓ Consultoría técnica en robótica</li>
                <li>✓ Capacitaciones personalizadas</li>
                <li>✓ Análisis técnico de competencias</li>
                <li>✓ Diseño de robots a medida</li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition">
              <h3 className="font-bold text-lg mb-4 text-cyan-400">📞 Contacto</h3>
              <p className="text-sm text-gray-300 mb-4">
                Contáctanos sin compromiso para resolver dudas o explorar opciones personalizadas
              </p>
              <a href="mailto:info@xprit-robotics.com" className="text-blue-400 hover:text-blue-300 font-semibold">
                📧 info@xprit-robotics.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
