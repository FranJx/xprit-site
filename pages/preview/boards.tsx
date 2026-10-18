import { useState, useRef, useEffect, ReactElement } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import PreviewLayout from '../../components/preview/Layout'
import StlViewer from '../../components/preview/StlViewer'

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
  highlight?: string
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

export default function PreviewBoards() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeCodeLang, setActiveCodeLang] = useState<string>('Dragon XT (ESP-NOW)')

  // Hero scroll animation
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end center'],
  })
  
  const rotateHeroY = useTransform(scrollYProgress, [0, 0.4], [0, 25])
  const rotateHeroX = useTransform(scrollYProgress, [0, 0.4], [0, -10])

  // Línea oficial de Hardware XpriT Robotics
  const cards: CardConfig[] = [
    {
      id: 'dragon-xt',
      name: 'Dragon XT',
      category: 'ESP32 Control Hub',
      closedImage: '/images/minisumo-closed.webp',
      openImage: '/images/minisumo-open.webp',
      highlight: 'Comercializada por JJ Robótica',
      specs: {
        processor: 'ESP32 Dual Core @ 240MHz',
        memory: '520 KB SRAM + 4 MB Flash',
        gpio: 'Driver dual de motor (1.2A continuos por canal)',
        interfaces: 'WiFi, Bluetooth Classic, BLE, ESP-NOW',
      },
    },
    {
      id: 'xt-prime',
      name: 'XT-Prime',
      category: 'Plataforma Modular',
      closedImage: '/images/velocista-closed.webp',
      openImage: '/images/velocista-open.webp',
      specs: {
        processor: 'ARM Cortex-M4 / STM32',
        memory: 'Fusión de sensores y telemetría rápida',
        gpio: 'Salidas PWM de alta frecuencia para MOSFETs',
        interfaces: 'I2C, SPI, UART, Puertos de expansión',
      },
    },
    {
      id: 'xt-rc',
      name: 'XT-RC',
      category: 'Radiocontrol Competitivo',
      closedImage: '/images/laberinto-closed.webp',
      openImage: '/images/laberinto-open.webp',
      specs: {
        processor: 'Microcontrolador de ultra baja latencia',
        memory: 'Procesamiento de pulsos PPM / SBUS',
        gpio: 'Puente H de alta corriente y reversa rápida',
        interfaces: 'RF 2.4GHz, Receptor integrado, Telemetría',
      },
    },
    {
      id: 'xt-samurai',
      name: 'XT-Samurai',
      category: 'Combate & Minisumo Pro',
      closedImage: '/images/minisumo-closed.webp',
      openImage: '/images/minisumo-open.webp',
      specs: {
        processor: 'Arquitectura optimizada para Minisumo',
        memory: 'Respuesta en microsegundos ante detección',
        gpio: 'Entradas para sensores de línea y oponente',
        interfaces: 'Lógica booleana de ataque y evasión',
      },
    },
  ]

  const hotspots: Hotspot[] = [
    {
      x: 20,
      y: 30,
      title: 'Módulo ESP32 / Cerebro Central',
      description: 'Doble núcleo a 240 MHz con conectividad inalámbrica nativa.',
      specs: 'Soporte completo para WiFi, Bluetooth BLE y protocolo de radio ultra rápido ESP-NOW.',
    },
    {
      x: 50,
      y: 25,
      title: 'Controlador Dual de Motores',
      description: 'Puente H integrado capaz de entregar hasta 1,2 A continuos por canal.',
      specs: 'Manejo eficiente de motores Pololu Micro Metal y N20 con control de velocidad por PWM.',
    },
    {
      x: 75,
      y: 35,
      title: 'Regulación & Protección de Potencia',
      description: 'Alimentación flexible para baterías LiPo de 2S y 3S.',
      specs: 'Filtrado de ruido electromagnético, diodos de protección y regulador térmicamente optimizado.',
    },
    {
      x: 35,
      y: 70,
      title: 'Conectores de Sensores & Expansión',
      description: 'Pines agrupados con alimentación y señal para sensores de distancia y ópticos.',
      specs: 'Compatible con sensores Sharp, ultrasonido HC-SR04 y sensores de piso QTR.',
    },
    {
      x: 70,
      y: 75,
      title: 'Puerto de Programación USB & Telemetría',
      description: 'Interfaz directa para carga de firmware y depuración serial.',
      specs: 'Conversor USB-UART integrado para flasheo con Arduino IDE, PlatformIO o ESP-IDF.',
    },
  ]

  const codeExamples: CodeExample[] = [
    {
      language: 'Dragon XT (ESP-NOW)',
      title: 'Control Inalámbrico Ultrarrápido',
      code: `// XpriT Robotics — Placa Dragon XT
// Control bidireccional por protocolo ESP-NOW (< 3ms latencia)
#include <esp_now.h>
#include <WiFi.h>

#define MOTOR_A_PWM 18
#define MOTOR_A_DIR 19
#define MOTOR_B_PWM 22
#define MOTOR_B_DIR 23

typedef struct struct_message {
    int8_t throttle;
    int8_t steering;
} struct_message;

struct_message controlData;

void onDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
    memcpy(&controlData, incomingData, sizeof(controlData));
    
    // Mezcla diferencial para tracción
    int leftMotor = controlData.throttle + controlData.steering;
    int rightMotor = controlData.throttle - controlData.steering;
    
    digitalWrite(MOTOR_A_DIR, leftMotor >= 0 ? HIGH : LOW);
    analogWrite(MOTOR_A_PWM, constrain(abs(leftMotor), 0, 255));
    
    digitalWrite(MOTOR_B_DIR, rightMotor >= 0 ? HIGH : LOW);
    analogWrite(MOTOR_B_PWM, constrain(abs(rightMotor), 0, 255));
}

void setup() {
    Serial.begin(115200);
    WiFi.mode(WIFI_STA);
    
    pinMode(MOTOR_A_PWM, OUTPUT);
    pinMode(MOTOR_A_DIR, OUTPUT);
    pinMode(MOTOR_B_PWM, OUTPUT);
    pinMode(MOTOR_B_DIR, OUTPUT);

    if (esp_now_init() != ESP_OK) {
        Serial.println("Error inicializando ESP-NOW");
        return;
    }
    esp_now_register_recv_cb(esp_now_recv_cb_t(onDataRecv));
    Serial.println("Dragon XT lista para recibir comandos.");
}

void loop() {
    // El control corre en interrupción de hardware por radio
    delay(10);
}`,
    },
    {
      language: 'Arduino / C++',
      title: 'Control de Motores con Puente H',
      code: `// Dragon XT — Conducción por PWM en motores N20
#define MOTOR_L_PWM 18
#define MOTOR_L_DIR 19
#define MOTOR_R_PWM 22
#define MOTOR_R_DIR 23

void setup() {
  pinMode(MOTOR_L_PWM, OUTPUT);
  pinMode(MOTOR_L_DIR, OUTPUT);
  pinMode(MOTOR_R_PWM, OUTPUT);
  pinMode(MOTOR_R_DIR, OUTPUT);
  Serial.begin(115200);
}

void drive(int speedL, int speedR) {
  digitalWrite(MOTOR_L_DIR, speedL >= 0 ? HIGH : LOW);
  analogWrite(MOTOR_L_PWM, abs(speedL));
  
  digitalWrite(MOTOR_R_DIR, speedR >= 0 ? HIGH : LOW);
  analogWrite(MOTOR_R_PWM, abs(speedR));
}

void loop() {
  drive(200, 200); // Avanzar a media potencia
  delay(1500);
  drive(-150, 150); // Giro sobre su eje
  delay(400);
}`,
    },
    {
      language: 'MicroPython',
      title: 'Script de Telemetría BLE',
      code: `from machine import Pin, PWM
import time

# Dragon XT en MicroPython
motor_left = PWM(Pin(18), freq=25000, duty=0)
dir_left = Pin(19, Pin.OUT)

def set_speed(pct):
    duty_val = int((pct / 100.0) * 1023)
    dir_left.value(1 if pct >= 0 else 0)
    motor_left.duty(abs(duty_val))

print("Dragon XT inicializada en MicroPython")
set_speed(75)
time.sleep(2)
set_speed(0)`,
    },
  ]

  const copyCode = (code: string, language: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(language)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const activeExample = codeExamples.find(ex => ex.language === activeCodeLang) || codeExamples[0]

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden text-white">
      {/* Background grid */}
      <div className="absolute inset-0 grid-lines opacity-[0.08] pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-6">
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <span className="font-mono text-[0.65rem] tracking-[0.3em] text-red-500 uppercase mb-3 block font-semibold">
                // INGENIERÍA EMBEBIDA // LÍNEA DE PLACAS XT
              </span>
              <h1 className="font-display font-black text-5xl md:text-6xl tracking-tight text-white mb-6">
                Hardware propio. <br />
                <span className="bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">Diseñado en Misiones.</span>
              </h1>
              <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-8 max-w-lg font-sans">
                Desarrollamos soluciones electrónicas personalizadas para robótica de competición y educación. Desde la placa <strong>Dragon XT</strong> (con ESP32 y control dual de motores) hasta plataformas modulares para minisumo y combate.
              </p>

              {/* Mención comercial a JJ Robótica */}
              <div className="p-4 rounded-xl bg-[#14151b] border border-white/10 mb-8 max-w-lg">
                <span className="font-mono text-[0.62rem] text-red-400 font-semibold block mb-1">
                  // ALIANZA DE DISTRIBUCIÓN OFICIAL:
                </span>
                <p className="font-sans text-xs text-zinc-300">
                  La placa <strong>Dragon XT</strong> es comercializada y distribuida en alianza estratégica con <strong>JJ Robótica</strong> para competidores y escuelas técnicas de todo el país.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 font-mono text-[0.68rem] tracking-wider text-zinc-400 border-l-2 border-red-500 pl-6 py-2">
                <span>MCU: ESP32 / ARM</span>
                <span className="text-zinc-600">|</span>
                <span>Dual Motor: 1.2A/canal</span>
                <span className="text-zinc-600">|</span>
                <span>Radio: ESP-NOW & BLE</span>
              </div>
            </div>

            {/* Rotating Hero Image */}
            <div className="relative flex justify-center items-center">
              <div className="absolute w-[450px] h-[450px] bg-red-600/10 rounded-full filter blur-[100px] pointer-events-none z-0" />
              <motion.div 
                style={{ rotateY: rotateHeroY, rotateX: rotateHeroX, transformStyle: 'preserve-3d' }}
                className="relative w-[340px] md:w-[420px] aspect-square z-10 cursor-grab active:cursor-grabbing"
              >
                <Image
                  src="/images/board-hero.webp"
                  alt="Placa XpriT Hardware"
                  fill
                  className="object-contain filter drop-shadow-[0_20px_50px_rgba(239,68,68,0.2)]"
                  unoptimized
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* PLACAS DE LA LÍNEA XT */}
      <section className="py-24 px-6 border-t border-white/10 bg-[#0e0f14] relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-red-500 uppercase mb-2 font-semibold">
              [ CATÁLOGO DE HARDWARE PROPIO ]
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white">
              Ecosistema de Placas Electrónicas
            </h2>
            <p className="text-xs text-zinc-400 mt-2 max-w-xl">
              Diseñadas para maximizar la potencia, soportar picos de corriente y responder en microsegundos durante combates y carreras.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => {
              const isOpen = activeCard === card.id
              return (
                <div
                  key={card.id}
                  className="bg-[#14151b] border border-white/10 hover:border-red-500/50 rounded-2xl p-6 flex flex-col justify-between min-h-[480px] relative group transition-all"
                  onMouseEnter={() => setActiveCard(card.id)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-[0.6rem] text-red-400 tracking-wider uppercase font-semibold">
                        // {card.category}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-2xl text-white mb-2">
                      {card.name}
                    </h3>

                    {card.highlight && (
                      <span className="font-mono text-[0.55rem] text-red-400 bg-red-600/10 border border-red-500/20 px-2 py-0.5 rounded block mb-3">
                        {card.highlight}
                      </span>
                    )}
                  </div>

                  {/* Interactive Swap Image Container */}
                  <div className="relative w-full h-44 bg-black/40 border border-white/5 rounded-xl flex items-center justify-center overflow-hidden my-4">
                    <div className={`absolute w-36 h-36 transition-all duration-500 ease-out ${isOpen ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100'}`}>
                      <Image
                        src={card.closedImage}
                        alt={`${card.name} Cerrado`}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    
                    <div className={`absolute w-36 h-36 transition-all duration-500 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-110 blur-sm'}`}>
                      <Image
                        src={card.openImage}
                        alt={`${card.name} Explotado`}
                        fill
                        className="object-contain filter drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Technical details block */}
                  <div className="border-t border-white/5 pt-4 space-y-2 text-[0.68rem] font-mono">
                    <div className="text-zinc-400">
                      <strong className="text-zinc-200">CPU:</strong> {card.specs.processor}
                    </div>
                    <div className="text-zinc-400">
                      <strong className="text-zinc-200">DRIVER:</strong> {card.specs.gpio}
                    </div>
                    <div className="text-zinc-400">
                      <strong className="text-zinc-200">BUS:</strong> {card.specs.interfaces}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          NUEVA SECCIÓN: VISOR 3D CAD OPEN SOURCE (GitHub Integration)
          ========================================================================= */}
      <section className="py-24 px-6 border-t border-white/10 bg-[#090a0f] relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col items-center text-center mb-12">
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-red-500 uppercase mb-2 font-semibold">
              [ INGENIERÍA 3D & REPOSITORIO GITHUB ]
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white">
              Modelos 3D y Chasis Open Source
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl font-sans">
              Inspecciona los modelos CAD 3D de nuestros desarrollos competitivos. Presentamos la arquitectura mecánica del vehículo autónomo <strong>Kmioncito</strong> (WRO 2025 Singapur).
            </p>
          </div>

          {/* 3D STL Interactive Viewer */}
          <StlViewer
            title="Kmioncito — Chasis & Arquitectura Mecánica WRO 2025"
            repoUrl="https://github.com/FranJx/XPRITROBOTICS_FE_2025"
            height="460px"
          />

          <div className="mt-8 text-center">
            <a
              href="https://github.com/FranJx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <span>Ver todos los repositorios y modelos 3D en GitHub oficial:</span>
              <strong className="text-red-400 underline">github.com/FranJx →</strong>
            </a>
          </div>

        </div>
      </section>

      {/* BOARD HOTSPOTS */}
      <section className="py-24 px-6 border-t border-white/10 bg-[#0c0d12] relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-red-500 uppercase mb-2 font-semibold">
              [ ANATOMÍA DE LA PLACA DRAGON XT ]
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white">
              Puntos de Control e Integración
            </h2>
            <p className="text-xs text-zinc-400 mt-2">Haz click sobre los puntos de la placa para ver sus especificaciones técnicas de circuito</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            
            {/* Left Specs Panel */}
            <div className="space-y-6 lg:order-1 order-2">
              <div className="font-mono text-[0.62rem] tracking-[0.25em] text-red-500 font-semibold">
                // TELEMETRÍA DE CIRCUITO
              </div>
              
              {activeHotspot !== null ? (
                <div className="p-6 border border-red-500/50 bg-[#14151b] rounded-2xl shadow-xl">
                  <span className="font-mono text-[0.6rem] text-red-400 font-bold mb-1 block">
                    COMPONENTE 0{activeHotspot + 1} // SELECCIONADO
                  </span>
                  <h4 className="font-display font-bold text-xl text-white mb-2">
                    {hotspots[activeHotspot].title}
                  </h4>
                  <p className="font-mono text-xs text-zinc-300 mb-3">
                    {hotspots[activeHotspot].description}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {hotspots[activeHotspot].specs}
                  </p>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-white/10 rounded-2xl bg-black/40 text-center font-mono text-xs text-zinc-500">
                  HAZ CLICK EN UN PUNTO DE LA PLACA PARA VER SU DESCRIPCIÓN
                </div>
              )}
            </div>

            {/* Central Interactive Hotspots Board */}
            <div className="lg:col-span-2 relative flex justify-center items-center lg:order-2 order-1">
              <div className="relative w-full max-w-2xl aspect-[16/9] border border-white/10 rounded-2xl overflow-hidden bg-black/50 shadow-2xl">
                <Image
                  src="/images/board-specs.webp"
                  alt="Placa con hotspots"
                  fill
                  className="object-contain"
                  unoptimized
                />
                
                {/* Hotspot buttons */}
                {hotspots.map((hotspot, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center border transition-all duration-300 focus:outline-none ${
                      activeHotspot === i 
                        ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.8)] scale-110' 
                        : 'bg-black/80 text-red-400 border-white/20 hover:border-red-500'
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CODE CONSOLE SECTION */}
      <section className="py-24 px-6 border-t border-white/10 bg-[#0e0f14] relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-red-500 uppercase mb-2 font-semibold">
              [ SDK & PROGRAMACIÓN ]
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white">
              Ejemplos de Firmware
            </h2>
            <p className="text-xs text-zinc-400 mt-2">Código listo para compilar y flashear en placas Dragon XT</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Lang selectors */}
            <div className="space-y-3">
              <div className="font-mono text-[0.62rem] tracking-[0.25em] text-zinc-500 uppercase mb-4">
                // SELECCIONAR PROTOCOLO
              </div>
              
              {codeExamples.map((ex) => (
                <button
                  key={ex.language}
                  onClick={() => setActiveCodeLang(ex.language)}
                  className={`w-full text-left font-mono text-xs tracking-wider p-4 border rounded-xl transition-all ${
                    activeCodeLang === ex.language
                      ? 'border-red-500 bg-red-600/10 text-white shadow-lg'
                      : 'border-white/10 bg-[#14151b] text-zinc-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{ex.language}</span>
                    <span className="text-[0.6rem] text-red-400">READY</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Terminal IDE Display */}
            <div className="lg:col-span-2 border border-white/10 bg-[#08080c] rounded-2xl overflow-hidden flex flex-col justify-between min-h-[420px] relative shadow-2xl">
              
              {/* Terminal header bar */}
              <div className="bg-[#111218] px-6 py-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2 font-mono text-[0.65rem] tracking-wider text-zinc-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-3 font-mono text-zinc-500">{activeExample.title}</span>
                </div>
                
                <button 
                  onClick={() => copyCode(activeExample.code, activeExample.language)}
                  className="font-mono text-xs tracking-wider text-zinc-300 border border-white/20 px-3 py-1.5 rounded-lg hover:border-red-500 hover:text-white transition-colors"
                >
                  {copiedCode === activeExample.language ? '✓ COPIADO!' : 'COPIAR CÓDIGO'}
                </button>
              </div>

              {/* Code print body */}
              <pre className="flex-grow p-6 overflow-x-auto font-mono text-xs text-zinc-300 leading-relaxed select-text bg-[#050508]">
                <code>{activeExample.code}</code>
              </pre>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

PreviewBoards.getLayout = function getLayout(page: ReactElement) {
  return <PreviewLayout>{page}</PreviewLayout>
}
