'use client'

import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

interface CardConfig {
  id: string
  name: string
  category: string
  closedImage: string
  openImage: string
  specs: {
    processor: string
    memory: string
    gpio: string
    interfaces: string
  }
}

interface Hotspot {
  x: number
  y: number
  title: string
  description: string
  specs: string
}

interface CodeExample {
  language: string
  title: string
  code: string
}

export default function BoardsPage() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Hero scroll animation
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end center'],
  })
  const rotateHero = useTransform(scrollYProgress, [0, 0.3], [0, 18])

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const cards: CardConfig[] = [
    {
      id: 'minisumo-pro',
      name: 'Minisumo Pro',
      category: 'Sumo',
      closedImage: '/images/minisumo-closed.webp',
      openImage: '/images/minisumo-open.webp',
      specs: {
        processor: 'ARM Cortex-M4 @ 168MHz',
        memory: '192 KB RAM + 1 MB Flash',
        gpio: '16 PWM channels (16-bit)',
        interfaces: 'I2C, SPI, UART, CAN Bus',
      },
    },
    {
      id: 'velocista-pro',
      name: 'Velocista Pro',
      category: 'Velocidad',
      closedImage: '/images/velocista-closed.webp',
      openImage: '/images/velocista-open.webp',
      specs: {
        processor: 'ARM Cortex-M7 @ 216MHz',
        memory: '256 KB RAM + 2 MB Flash',
        gpio: '20 PWM channels (16-bit)',
        interfaces: 'I2C, SPI, UART, USB, CAN Bus',
      },
    },
    {
      id: 'laberinto-pro',
      name: 'Laberinto Pro',
      category: 'Laberinto',
      closedImage: '/images/laberinto-closed.webp',
      openImage: '/images/laberinto-open.webp',
      specs: {
        processor: 'ARM Cortex-M4 @ 168MHz',
        memory: '192 KB RAM + 1 MB Flash',
        gpio: '12 PWM channels + 8 ADC',
        interfaces: 'I2C, SPI, UART, Encoder inputs',
      },
    },
  ]

  const hotspots: Hotspot[] = [
    {
      x: 15,
      y: 25,
      title: 'Procesador Principal',
      description: 'ARM Cortex-M4 @ 168MHz',
      specs: '192 KB RAM, 1 MB Flash',
    },
    {
      x: 45,
      y: 20,
      title: 'Regulador de Potencia',
      description: 'Entrada 5V-12V',
      specs: 'Salida 3.3V/2A, Protección BEC',
    },
    {
      x: 75,
      y: 30,
      title: 'Conector CAN',
      description: 'Bus de comunicación',
      specs: '250 kbps - 1 Mbps',
    },
    {
      x: 30,
      y: 70,
      title: 'Pines GPIO',
      description: '16 salidas PWM',
      specs: '16-bit, hasta 2 MHz',
    },
    {
      x: 70,
      y: 75,
      title: 'Conector de Depuración',
      description: 'SWD/JTAG',
      specs: 'Para programación y debugging',
    },
  ]

  const codeExamples: CodeExample[] = [
    {
      language: 'Arduino',
      title: 'Inicialización Básica',
      code: `// Configuración de pines PWM
#define MOTOR_LEFT 3
#define MOTOR_RIGHT 5
#define SENSOR_LINE A0

void setup() {
  pinMode(MOTOR_LEFT, OUTPUT);
  pinMode(MOTOR_RIGHT, OUTPUT);
  Serial.begin(115200);
}

void motorMove(int leftSpeed, int rightSpeed) {
  analogWrite(MOTOR_LEFT, leftSpeed);
  analogWrite(MOTOR_RIGHT, rightSpeed);
}

void loop() {
  int sensorValue = analogRead(SENSOR_LINE);
  motorMove(255, 200); // Movimiento diferencial
  delay(10);
}`,
    },
    {
      language: 'ESP-IDF',
      title: 'Configuración PWM',
      code: `#include "driver/ledc.h"

void pwm_init() {
  ledc_timer_config_t timer_conf = {
    .speed_mode = LEDC_HIGH_SPEED_MODE,
    .timer_num = LEDC_TIMER_0,
    .duty_resolution = LEDC_TIMER_16_BIT,
    .freq_hz = 20000
  };
  ledc_timer_config(&timer_conf);

  ledc_channel_config_t channel_conf = {
    .gpio_num = 26,
    .speed_mode = LEDC_HIGH_SPEED_MODE,
    .channel = LEDC_CHANNEL_0,
    .timer_sel = LEDC_TIMER_0,
    .duty = 5000
  };
  ledc_channel_config(&channel_conf);
}`,
    },
    {
      language: 'MicroPython',
      title: 'Control de Motores',
      code: `from machine import PWM, Pin
import time

# Configurar PWM para motores
motor_left = PWM(Pin(3), freq=20000, duty=0)
motor_right = PWM(Pin(5), freq=20000, duty=0)

def move_forward(speed=512):
    motor_left.duty(speed)
    motor_right.duty(speed)

def turn_left(speed=512):
    motor_left.duty(int(speed * 0.5))
    motor_right.duty(speed)

# Ejecutar movimiento
move_forward(800)
time.sleep(1)
turn_left(600)`,
    },
  ]

  const copyCode = (code: string, language: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(language)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <>
      <Head>
        <title>Plataforma XpriT — Una placa. Infinidad de robots.</title>
        <meta
          name="description"
          content="Descubre la plataforma XpriT: una placa de control versátil para crear infinidad de robots de competición."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black overflow-hidden">
        {/* HERO SECTION */}
        <section
          ref={containerRef}
          className="min-h-screen flex items-center justify-center p-8 relative"
        >
          {/* Fondo con gradiente animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 opacity-50" />

          <div className="relative z-10 max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contenido del hero */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                  Una placa.
                  <br />
                  Infinidad de robots.
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                  La plataforma de control versátil para construir cualquier robot de competición.
                  Diseñada para máximo rendimiento, flexibilidad y facilidad de uso.
                </p>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                  >
                    Explorar →
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border border-gray-400 text-gray-300 font-semibold rounded-lg hover:border-cyan-400 hover:text-cyan-300 transition-all"
                  >
                    Documentación
                  </motion.button>
                </div>
              </motion.div>

              {/* Imagen del hero con scroll animation */}
              <motion.div
                className="flex justify-center"
                style={{ rotate: prefersReducedMotion ? 0 : rotateHero }}
              >
                <div className="w-full max-w-sm h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 flex items-center justify-center relative overflow-hidden shadow-2xl shadow-cyan-500/20">
                  <Image
                    src="/images/board-hero.webp"
                    alt="Placa XpriT"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CARDS SECTION - EXPLODED VIEWS */}
        <section className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-5xl font-bold mb-4 text-cyan-300">
                Configuraciones Versátiles
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl">
                La misma placa, adaptada para diferentes disciplinas. Toca para ver vista explotada.
              </p>
            </motion.div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  className="group cursor-pointer"
                  onClick={() =>
                    setActiveCard(activeCard === card.id ? null : card.id)
                  }
                  onHoverStart={() => !prefersReducedMotion && setActiveCard(card.id)}
                  onHoverEnd={() => setActiveCard(null)}
                >
                  {/* Card Container */}
                  <div className="relative h-96 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:border-cyan-500">
                    {/* Imagen Cerrada/Abierta */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        opacity: activeCard === card.id ? 0 : 1,
                      }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                    >
                      <Image
                        src={card.closedImage}
                        alt={`${card.name} - Vista Cerrada`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </motion.div>

                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        opacity: activeCard === card.id ? 1 : 0,
                      }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                    >
                      <Image
                        src={card.openImage}
                        alt={`${card.name} - Vista Explotada`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </motion.div>

                    {/* Overlay degradado */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Información */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-cyan-300 mb-2">
                        {card.name}
                      </h3>
                      <p className="text-gray-400 mb-3 text-sm">
                        {card.category}
                      </p>

                      {activeCard === card.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="space-y-2 text-xs text-gray-300 mt-4 pt-4 border-t border-gray-700"
                        >
                          <div>
                            <span className="text-cyan-300">CPU:</span> {card.specs.processor}
                          </div>
                          <div>
                            <span className="text-cyan-300">Memoria:</span> {card.specs.memory}
                          </div>
                          <div>
                            <span className="text-cyan-300">GPIO:</span> {card.specs.gpio}
                          </div>
                          <div>
                            <span className="text-cyan-300">Interfaces:</span> {card.specs.interfaces}
                          </div>
                        </motion.div>
                      )}

                      <p className="text-xs text-gray-500 mt-3">
                        {activeCard === card.id ? '✓ Vista Explotada' : 'Toca para explorar'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOTSPOTS SECTION */}
        <section className="py-20 px-8 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-5xl font-bold mb-4 text-cyan-300">
                Especificaciones Técnicas
              </h2>
              <p className="text-gray-400 text-lg">
                Interactúa con cada componente para conocer sus características.
              </p>
            </motion.div>

            {/* Board Image with Hotspots */}
            <div className="relative w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
              <div className="relative w-full pb-[56.25%]">
                {' '}
                {/* 16:9 aspect ratio */}
                <Image
                  src="/images/board-specs.webp"
                  alt="Placa XpriT - Especificaciones"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Hotspots */}
              {hotspots.map((hotspot, idx) => (
                <motion.div
                  key={idx}
                  className="absolute group"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseEnter={() => setActiveHotspot(idx)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  onClick={() =>
                    setActiveHotspot(activeHotspot === idx ? null : idx)
                  }
                >
                  {/* Hotspot Button */}
                  <motion.button
                    className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center cursor-pointer hover:bg-cyan-500/40 transition-all"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-2 h-2 bg-cyan-300 rounded-full" />
                  </motion.button>

                  {/* Tooltip */}
                  {(activeHotspot === idx || true) && (
                    <motion.div
                      className="absolute left-16 top-0 min-w-64 bg-gray-900 border border-cyan-500/50 rounded-lg p-4 shadow-xl pointer-events-none z-50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: activeHotspot === idx ? 1 : 0.3,
                        x: activeHotspot === idx ? 0 : -10,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="text-cyan-300 font-bold mb-2">
                        {hotspot.title}
                      </h4>
                      <p className="text-gray-300 text-sm mb-2">
                        {hotspot.description}
                      </p>
                      <p className="text-gray-400 text-xs">{hotspot.specs}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CODE EXAMPLES SECTION */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-5xl font-bold mb-4 text-cyan-300">
                Ejemplos de Código
              </h2>
              <p className="text-gray-400 text-lg">
                Comienza a programar en segundos. Copia cualquier ejemplo para tu proyecto.
              </p>
            </motion.div>

            {/* Code Cards */}
            <div className="space-y-8">
              {codeExamples.map((example, idx) => (
                <motion.div
                  key={idx}
                  className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
                    <div>
                      <p className="text-cyan-400 font-semibold text-sm">
                        {example.language}
                      </p>
                      <h4 className="text-white font-bold">{example.title}</h4>
                    </div>
                    <motion.button
                      onClick={() => copyCode(example.code, example.language)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded hover:bg-cyan-500/30 transition-all font-mono text-sm"
                    >
                      {copiedCode === example.language
                        ? '✓ Copiado'
                        : 'Copiar'}
                    </motion.button>
                  </div>

                  {/* Code Block */}
                  <pre className="p-6 overflow-x-auto bg-gray-950 text-gray-300 font-mono text-sm leading-relaxed max-h-64 overflow-y-auto">
                    <code>{example.code}</code>
                  </pre>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6 text-white">
                Listo para comenzar?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Accede a la documentación completa, tutoriales y comunidad de desarrolladores.
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  Ver Documentación →
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-gray-400 text-gray-300 font-semibold rounded-lg hover:border-cyan-400 hover:text-cyan-300 transition-all"
                >
                  Contactar
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
