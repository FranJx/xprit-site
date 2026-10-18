import { ReactElement, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import PreviewLayout from '../../components/preview/Layout'

interface SponsorPlan {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  image: string;
  priceUSD: number;
  minDuration: string;
  benefits: string[];
}

export default function PreviewSponsors() {
  const [activePlan, setActivePlan] = useState<string | null>(null)

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
      ]
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
        'Remera del equipo con logo'
      ]
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
        'Bandera de sponsor en stand en torneos',
        'Descuento 25% en servicios de consultoría'
      ]
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
        'Video publicitario largo (2-3 min)',
        'Bandera principal en stand + área destacada',
        'Robot con branding personalizado',
        'Descuento 35% en servicios de consultoría'
      ]
    }
  ];

  return (
    <div className="relative w-full py-16 px-6 min-h-[85vh]">
      <div className="absolute inset-0 grid-lines opacity-[0.1] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col mb-16 border-b border-[rgba(0,240,255,0.06)] pb-8">
          <span className="font-mono text-[0.62rem] tracking-[0.35em] text-[var(--preview-cyan)] uppercase mb-3 block">
            // PARNERSHIPS.DAT // SPONSORS_PROGRAM.exe
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white">
            Programa de Sponsors
          </h1>
          <p className="text-xs text-[var(--preview-fg-dim)] mt-3 leading-relaxed max-w-lg">
            Apoya a la robótica competitiva argentina y potencia tu marca estableciendo alianzas estratégicas con XpriT Robotics para la temporada 2025.
          </p>
        </div>

        {/* Info Box: About XpriT */}
        <section className="mb-20 relative p-8 border border-fine bg-[var(--preview-ink)]/50 rounded-lg">
          <div className="hud-corner tl" />
          <div className="hud-corner br" />
          
          <h2 className="font-display font-bold text-2xl text-white mb-6">Sobre XpriT & Tu Apoyo</h2>
          <div className="space-y-4 text-xs md:text-sm text-[var(--preview-fg-dim)] leading-relaxed">
            <p>
              XpriT Robotics es el equipo de robótica más destacado de la provincia de Misiones, con más de 100 podios provinciales y logros nacionales e internacionales. Representamos a Argentina en torneos como <span className="text-[var(--preview-cyan)]">RoboChallenge (Rumania)</span>, <span className="text-[var(--preview-cyan)]">RSM Challenge (Brasil)</span> y <span className="text-[var(--preview-cyan)]">WRO</span>.
            </p>
            <p>
              Los fondos recaudados a través de nuestro programa de patrocinio se destinan en su totalidad a la <span className="text-white font-mono">compra de insumos electrónicos, prototipado 3D, inscripción a torneos y traslados de los competidores</span>.
            </p>
            <p className="text-[var(--preview-cyan)] font-mono text-[0.68rem] tracking-wider border-t border-fine pt-4 mt-2">
              ✓ NINGÚN FONDO ES DESTINADO A GASTOS PERSONALES // COMPROMISO ÉTICO DE TRANSPARENCIA TOTAL.
            </p>
          </div>
        </section>

        {/* Sponsor Cards Grid */}
        <section className="mb-24">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-mono text-[0.62rem] tracking-[0.3em] text-[var(--preview-cyan)] uppercase mb-2">
              [ NIVELES DE SPONSORSHIP ]
            </span>
            <h2 className="font-display font-bold text-3xl text-white">
              Planes de Sponsorship
            </h2>
            <div className="w-12 h-[1px] bg-[var(--preview-cyan)] mt-4" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorPlans.map((plan) => {
              const isRecommended = plan.id === 'diamante'
              return (
                <div
                  key={plan.id}
                  className={`glass-panel rounded-lg p-6 flex flex-col justify-between min-h-[500px] relative transition-all duration-300 ${
                    isRecommended ? 'border-[var(--preview-cyan)]/50 shadow-[0_0_20px_rgba(0,240,255,0.08)]' : ''
                  }`}
                  onMouseEnter={() => setActivePlan(plan.id)}
                  onMouseLeave={() => setActivePlan(null)}
                >
                  <div className="hud-corner tl" />
                  <div className="hud-corner tr" />
                  <div className="hud-corner bl" />
                  <div className="hud-corner br" />

                  {isRecommended && (
                    <div className="absolute -top-3.5 right-6 font-mono text-[0.58rem] font-bold tracking-widest px-3 py-1 bg-gradient-to-r from-[var(--preview-cyan)] to-[var(--preview-blue)] text-black rounded uppercase">
                      RECOMENDADO
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-3xl">{plan.icon}</span>
                      <span className="font-mono text-[0.55rem] text-[var(--preview-fg-faint)] tracking-widest">
                        PLAN.{plan.id.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-2xl text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-[0.65rem] font-mono text-[var(--preview-fg-dim)] tracking-wider uppercase mb-6">
                      {plan.subtitle}
                    </p>

                    {/* Price */}
                    <div className="border-y border-fine py-4 mb-6">
                      <div className="font-display font-bold text-3xl text-white">
                        USD ${plan.priceUSD}
                      </div>
                      <div className="font-mono text-[0.58rem] text-[var(--preview-fg-faint)] tracking-wider mt-1 uppercase">
                        MÍNIMO: {plan.minDuration}
                      </div>
                    </div>

                    {/* Benefits */}
                    <ul className="space-y-3 mb-6">
                      {plan.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start font-mono text-[0.65rem] tracking-wider text-[var(--preview-fg-dim)]">
                          <span className="text-[var(--preview-cyan)] mr-2 font-bold">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`mailto:info@xprit-robotics.com?subject=Interes en Plan Sponsors - ${plan.name}`}
                    className={`block w-full text-center font-mono text-[0.68rem] tracking-[0.2em] font-bold py-3 rounded transition-all duration-300 pointer-events-auto ${
                      isRecommended
                        ? 'bg-[var(--preview-cyan)] text-black shadow-[0_0_15px_var(--preview-cyan-glow)] hover:scale-105'
                        : 'border border-fine text-white hover:border-[var(--preview-cyan)] hover:bg-[var(--preview-cyan-soft)]'
                    }`}
                  >
                    CONTACTAR.exe
                  </a>
                </div>
              )
            })}
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="mb-24">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="font-display font-bold text-2xl text-white">Comparativa Detallada</h2>
            <div className="w-12 h-[1px] bg-[var(--preview-cyan)] mt-3" />
          </div>

          <div className="overflow-x-auto glass-panel rounded-lg border border-fine">
            <table className="w-full text-left font-mono text-[0.68rem] tracking-wider border-collapse">
              <thead>
                <tr className="bg-[var(--preview-ink)] border-b border-fine">
                  <th className="px-6 py-4 font-bold text-[var(--preview-fg-dim)] uppercase">Característica</th>
                  <th className="px-6 py-4 font-bold text-white text-center">SILVER</th>
                  <th className="px-6 py-4 font-bold text-white text-center">GOLD</th>
                  <th className="px-6 py-4 font-bold text-white text-center">PLATINUM</th>
                  <th className="px-6 py-4 font-bold text-white text-center">DIAMANTE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.02)]">
                <tr className="hover:bg-[var(--preview-ink)]/30 transition">
                  <td className="px-6 py-4 text-white">Menciones Redes</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-dim)]">1x / MES</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-dim)]">2-3x / MES</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-dim)]">1x / SEMANA</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-dim)]">2x / DIARIO</td>
                </tr>
                <tr className="hover:bg-[var(--preview-ink)]/30 transition">
                  <td className="px-6 py-4 text-white">Página Personalizada</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-faint)]">—</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-faint)]">—</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-cyan)]">✓</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-cyan)]">✓</td>
                </tr>
                <tr className="hover:bg-[var(--preview-ink)]/30 transition">
                  <td className="px-6 py-4 text-white">Logo en Chasis</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-faint)]">—</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-faint)]">—</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-cyan)]">1 ROBOT</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-cyan)]">TODOS</td>
                </tr>
                <tr className="hover:bg-[var(--preview-ink)]/30 transition">
                  <td className="px-6 py-4 text-white">Indumentaria Equipo</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-faint)]">—</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-cyan)]">✓</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-cyan)]">✓</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-cyan)]">✓</td>
                </tr>
                <tr className="hover:bg-[var(--preview-ink)]/30 transition">
                  <td className="px-6 py-4 text-white">Video Publicitario</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-faint)]">—</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-faint)]">—</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-dim)]">30-60s</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-fg-dim)]">2-3 min</td>
                </tr>
                <tr className="hover:bg-[var(--preview-ink)]/30 transition">
                  <td className="px-6 py-4 text-white">Descuento Consultoría</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-ok)]">10%</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-ok)]">15%</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-ok)]">25%</td>
                  <td className="px-6 py-4 text-center text-[var(--preview-ok)]">35%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ONBOARDING PIPELINE */}
        <section className="mb-24">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="font-display font-bold text-2xl text-white">Proceso de Integración</h2>
            <div className="w-12 h-[1px] bg-[var(--preview-cyan)] mt-3" />
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: '01', icon: '📝', title: 'SOLICITUD', desc: 'Envías tus metas de patrocinio.' },
              { step: '02', icon: '✍️', title: 'ACUERDO', desc: 'Formalizamos el plan elegido.' },
              { step: '03', icon: '🎨', title: 'RECURSOS', desc: 'Vectorizamos tu marca y logo.' },
              { step: '04', icon: '🚀', title: 'DESPLIEGUE', desc: 'Tu marca se asocia en web y robots.' },
              { step: '05', icon: '📈', title: 'SEGUIMIENTO', desc: 'Reportes y telemetría de impacto.' },
            ].map((node, idx) => (
              <div key={idx} className="relative p-6 border border-fine bg-[var(--preview-ink)]/30 rounded text-center flex flex-col items-center justify-between min-h-[160px]">
                <div className="hud-corner tl" />
                <div className="hud-corner br" />
                
                <div className="font-mono text-[0.55rem] text-[var(--preview-cyan)] tracking-[0.25em] mb-3">
                  STAGE_{node.step}
                </div>
                
                <div className="text-3xl mb-2">{node.icon}</div>
                <h4 className="font-display font-bold text-sm text-white mb-2">{node.title}</h4>
                <p className="text-[0.62rem] text-[var(--preview-fg-dim)] leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="relative p-12 border border-fine bg-gradient-to-r from-[var(--preview-ink)]/70 to-[rgba(0,102,255,0.05)] rounded-lg text-center overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-[var(--preview-cyan-soft)]/5 to-transparent pointer-events-none" />
          
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            ¿Listo para apoyar a XpriT?
          </h2>
          <p className="text-xs text-[var(--preview-fg-dim)] max-w-lg mx-auto leading-relaxed mb-8">
            Si deseas un plan personalizado o tienes consultas sobre facturación e impacto comercial, no dudes en escribirnos por cualquiera de nuestros canales habilitados.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@xprit-robotics.com?subject=Consulta Programa de Sponsorship"
              className="font-mono text-[0.7rem] font-bold tracking-[0.2em] px-8 py-3 border border-[var(--preview-cyan)] text-white bg-[var(--preview-cyan-soft)] hover:bg-[var(--preview-cyan)] hover:text-black transition-all duration-300 pointer-events-auto shadow-[0_0_10px_rgba(0,240,255,0.05)]"
            >
              ENVIAR_CORREO.exe
            </a>
            <Link
              href="/preview/contacto"
              className="font-mono text-[0.7rem] font-bold tracking-[0.2em] px-8 py-3 border border-fine text-[var(--preview-fg-dim)] hover:text-white hover:border-[var(--preview-cyan)] transition-all duration-300 bg-[var(--preview-void)]/60 pointer-events-auto"
            >
              CONTACTO.dat
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}

PreviewSponsors.getLayout = function getLayout(page: ReactElement) {
  return <PreviewLayout>{page}</PreviewLayout>
}
