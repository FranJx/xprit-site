import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface SponsorPlan {
  id: string;
  name: string;
  image: string;
  priceUSD: number;
  priceARS: string;
  minDuration: string;
  profile: string;
  benefits: string[];
  color: string;
  bgGradient: string;
}

const sponsorPlans: SponsorPlan[] = [
  {
    id: 'silver',
    name: 'SILVER',
    image: '/images/sponsor-silver.svg',
    priceUSD: 50,
    priceARS: '$80,000 - $100,000',
    minDuration: '3 meses',
    profile: 'Pequeños negocios locales, influenciadores',
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
    image: '/images/sponsor-gold.svg',
    priceUSD: 150,
    priceARS: '$250,000 - $300,000',
    minDuration: '3 meses',
    profile: 'Empresas medianas locales, PyMEs tecnológicas',
    benefits: [
      'Logo en página web (sección sponsors - medio)',
      'Menciones en redes sociales (2-3x/semana)',
      'Stickers y materiales con logo',
      'Mención en notas de prensa',
      'Descuento 15% en servicios de consultoría',
      'Mención en eventos y competiciones'
    ],
    color: 'from-yellow-400 to-yellow-500',
    bgGradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    image: '/images/sponsor-platinum.svg',
    priceUSD: 300,
    priceARS: '$500,000 - $600,000',
    minDuration: '6 meses',
    profile: 'Empresas grandes regionales, marcas locales',
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
      'Descuento 25% en servicios de consultoría'
    ],
    color: 'from-blue-500 to-blue-600',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100'
  },
  {
    id: 'diamante',
    name: 'DIAMANTE',
    image: '/images/sponsor-diamond.svg',
    priceUSD: 500,
    priceARS: '$800,000+',
    minDuration: '12 meses',
    profile: 'Corporaciones, universidades, gobiernos provinciales',
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
      'Descuento 35% en servicios de consultoría'
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
        <meta name="description" content="Conoce nuestro programa de sponsorship y apoya el desarrollo de robótica competitiva en Argentina." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Programa de Sponsors | XpriT Robotics" />
        <meta property="og:description" content="Sponsorea a XpriT Robotics y obtén visibilidad con beneficios tangibles." />
        <meta property="og:type" content="website" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Programa de Sponsors
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Apoya el desarrollo de robótica competitiva en Argentina y obtén visibilidad con beneficios tangibles
            </p>
          </div>

          {/* Planes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {sponsorPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative group ${index === sponsorPlans.length - 1 ? 'lg:col-span-1' : ''}`}
              >
                {/* Glow effect para Diamante */}
                {plan.id === 'diamante' && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                )}

                <div className={`relative ${plan.bgGradient} rounded-xl p-8 h-full border border-gray-700 hover:border-gray-500 transition transform hover:scale-105`}>
                  {/* Badge */}
                  {plan.id === 'diamante' && (
                    <div className="absolute -top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-bold">
                      Recomendado
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto mb-3">
                      <img
                        src={plan.image}
                        alt={`${plan.name} Badge`}
                        className="w-full h-full"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.profile}</p>
                  </div>

                  {/* Precio */}
                  <div className="mb-6 pb-6 border-b border-gray-300">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      USD ${plan.priceUSD}
                    </div>
                    <div className="text-sm text-gray-600">{plan.priceARS}/mes</div>
                    <div className="text-xs text-gray-500 mt-2">Mínimo: {plan.minDuration}</div>
                  </div>

                  {/* Beneficios */}
                  <div className="mb-6">
                    <ul className="space-y-3">
                      {plan.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-800">
                          <span className="text-green-600 mr-3 font-bold">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <a
                    href="mailto:info@xprit-robotics.com?subject=Interés en Plan de Sponsorship"
                    className={`block w-full text-center py-3 rounded-lg font-bold transition transform hover:scale-105 ${
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

          {/* Comparativa */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Comparativa de Planes</h2>
            <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Característica</th>
                    {sponsorPlans.map((plan) => (
                      <th key={plan.id} className="px-6 py-4 text-center font-bold">
                        <div className="w-12 h-12 mx-auto mb-2">
                          <img
                            src={plan.image}
                            alt={`${plan.name} Badge`}
                            className="w-full h-full"
                          />
                        </div>
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="px-6 py-4 font-semibold">Aporte Mensual</td>
                    {sponsorPlans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        USD ${plan.priceUSD}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-6 py-4 font-semibold">Duración Mínima</td>
                    {sponsorPlans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        {plan.minDuration}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-6 py-4 font-semibold">Menciones Redes</td>
                    {[
                      { label: 'Mensual' },
                      { label: '2-3x/semana' },
                      { label: 'Diaria' },
                      { label: 'Diaria' }
                    ].map((item, idx) => (
                      <td key={idx} className="px-6 py-4 text-center">
                        {item.label}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-6 py-4 font-semibold">Página Personalizada</td>
                    {[false, false, true, true].map((included, idx) => (
                      <td key={idx} className="px-6 py-4 text-center">
                        {included ? '✓' : '—'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="px-6 py-4 font-semibold">Logo en Robots</td>
                    {[false, false, true, true].map((included, idx) => (
                      <td key={idx} className="px-6 py-4 text-center">
                        {included ? '✓' : '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Descuento Consultoría</td>
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

          {/* CTA Final */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 mb-8">
            <h2 className="text-3xl font-bold mb-4">¿Listo para apoyarnos?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Contacta con nosotros para discutir el plan que mejor se adapta a tu organización
            </p>
            <a
              href="mailto:info@xprit-robotics.com?subject=Consulta Programa de Sponsorship"
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition transform hover:scale-105"
            >
              Enviar Consulta
            </a>
          </div>

          {/* Info adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="font-bold text-lg mb-3">Proceso Simple</h3>
              <ol className="text-sm text-gray-300 space-y-2">
                <li>1. Elige tu plan</li>
                <li>2. Contacta con nosotros</li>
                <li>3. Acuerdo de sponsorship</li>
                <li>4. ¡Comienza la visibilidad!</li>
              </ol>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="font-bold text-lg mb-3">Beneficios Extra</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>✓ Asesoría técnica en robótica</li>
                <li>✓ Diseño personalizado</li>
                <li>✓ Capacitaciones</li>
                <li>✓ Análisis técnico</li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="font-bold text-lg mb-3">Contacto</h3>
              <p className="text-sm text-gray-300 mb-4">
                Escribinos para resolver dudas o consultas especiales
              </p>
              <a
                href="mailto:info@xprit-robotics.com"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                info@xprit-robotics.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
