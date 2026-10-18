import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface StlViewerProps {
  modelUrl?: string
  color?: string
  wireframe?: boolean
  autoRotate?: boolean
  height?: string
  title?: string
  repoUrl?: string
  availableParts?: Array<{ name: string; url?: string; description: string }>
}

export default function StlViewer({
  modelUrl,
  color = '#ef4444', // XpriT Red default
  autoRotate = true,
  height = '420px',
  title = 'Kmioncito — Chasis & Dirección Ackermann (WRO 2025)',
  repoUrl = 'https://github.com/FranJx/XPRITROBOTICS_FE_2025',
  availableParts = [
    { name: 'Chasis Principal', description: 'Estructura monocasco impresa en 3D para montaje de electrónica y batería LiPo 3S.' },
    { name: 'Dirección Ackermann', description: 'Sistema de geometría Ackermann accionada por servomotor MG90S para giros de precisión.' },
    { name: 'Soporte HuskyLens', description: 'Montura angular elevada con amortiguación para la cámara de visión artificial.' },
    { name: 'Soporte Sensores US', description: 'Fijación frontal y lateral para módulos de ultrasonido HC-SR04 y sensor IMU BNO055.' },
    { name: 'Transmisión & Eje N20', description: 'Caja reductora y encastres para motores DC N20 con encoders de cuadratura.' },
  ]
}: StlViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [selectedPart, setSelectedPart] = useState(0)
  const [isWireframe, setIsWireframe] = useState(false)
  const [isRotating, setIsRotating] = useState(autoRotate)
  const [materialColor, setMaterialColor] = useState(color)
  const [loading, setLoading] = useState(false)
  const controlsRef = useRef<OrbitControls | null>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null)

  useEffect(() => {
    const currentMount = mountRef.current
    if (!currentMount) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0c0d12)

    // Camera setup
    const width = currentMount.clientWidth || 600
    const heightPx = currentMount.clientHeight || 420
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000)
    camera.position.set(60, 45, 60)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, heightPx)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    currentMount.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = isRotating
    controls.autoRotateSpeed = 1.5
    controls.maxDistance = 200
    controls.minDistance = 15
    controlsRef.current = controls

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8)
    keyLight.position.set(50, 70, 50)
    keyLight.castShadow = true
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xef4444, 0.9)
    fillLight.position.set(-50, -20, -50)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0x00f0ff, 1.2, 100)
    rimLight.position.set(0, 50, -40)
    scene.add(rimLight)

    // Technical Grid / Ground
    const gridHelper = new THREE.GridHelper(100, 20, 0xef4444, 0x22242f)
    gridHelper.position.y = -15
    scene.add(gridHelper)

    // Material
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(materialColor),
      roughness: 0.35,
      metalness: 0.25,
      wireframe: isWireframe,
    })
    materialRef.current = material

    let currentMesh: THREE.Mesh | null = null

    // Procedural robot chassis demo geometry if no remote STL file is fetched
    const createFallbackGeometry = (partIndex: number) => {
      const group = new THREE.Group()

      if (partIndex === 0) {
        // Main Chassis
        const bodyGeo = new THREE.BoxGeometry(45, 8, 26)
        const bodyMesh = new THREE.Mesh(bodyGeo, material)
        bodyMesh.castShadow = true
        group.add(bodyMesh)

        // Cabin / top deck
        const topGeo = new THREE.BoxGeometry(25, 10, 20)
        const topMesh = new THREE.Mesh(topGeo, material)
        topMesh.position.set(-5, 8, 0)
        group.add(topMesh)
      } else if (partIndex === 1) {
        // Ackermann Steering
        const rodGeo = new THREE.CylinderGeometry(1.5, 1.5, 28, 16)
        const rodMesh = new THREE.Mesh(rodGeo, material)
        rodMesh.rotation.z = Math.PI / 2
        group.add(rodMesh)

        const servoGeo = new THREE.BoxGeometry(12, 12, 12)
        const servoMesh = new THREE.Mesh(servoGeo, material)
        servoMesh.position.y = 8
        group.add(servoMesh)
      } else if (partIndex === 2) {
        // HuskyLens Mount
        const mountGeo = new THREE.BoxGeometry(18, 18, 6)
        const mountMesh = new THREE.Mesh(mountGeo, material)
        group.add(mountMesh)

        const lensGeo = new THREE.CylinderGeometry(4, 4, 8, 32)
        const lensMesh = new THREE.Mesh(lensGeo, material)
        lensMesh.rotation.x = Math.PI / 2
        lensMesh.position.z = 5
        group.add(lensMesh)
      } else {
        // Sensor mount / gear
        const gearGeo = new THREE.CylinderGeometry(12, 12, 6, 24)
        const gearMesh = new THREE.Mesh(gearGeo, material)
        group.add(gearMesh)
      }

      return group
    }

    const loadModel = () => {
      setLoading(true)
      const part = availableParts[selectedPart]

      if (part?.url && part.url.endsWith('.stl')) {
        const loader = new STLLoader()
        loader.load(
          part.url,
          (geometry) => {
            geometry.center()
            geometry.computeVertexNormals()
            if (currentMesh) scene.remove(currentMesh)
            const mesh = new THREE.Mesh(geometry, material)
            mesh.castShadow = true
            mesh.receiveShadow = true
            scene.add(mesh)
            currentMesh = mesh
            setLoading(false)
          },
          undefined,
          () => {
            // Fallback to geometric preview
            if (currentMesh) scene.remove(currentMesh)
            const fallback = createFallbackGeometry(selectedPart)
            scene.add(fallback)
            currentMesh = fallback as any
            setLoading(false)
          }
        )
      } else {
        // Render detailed technical procedural model
        if (currentMesh) scene.remove(currentMesh)
        const fallback = createFallbackGeometry(selectedPart)
        scene.add(fallback)
        currentMesh = fallback as any
        setLoading(false)
      }
    }

    loadModel()

    // Animation Loop
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return
      const newWidth = currentMount.clientWidth
      const newHeight = currentMount.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [selectedPart, availableParts])

  // Update controls auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isRotating
    }
  }, [isRotating])

  // Update material properties
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.wireframe = isWireframe
      materialRef.current.color.set(materialColor)
    }
  }, [isWireframe, materialColor])

  return (
    <div className="bg-[#0c0d12] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#111218]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-[0.65rem] tracking-[0.2em] text-red-500 uppercase font-semibold">
              VISOR 3D CAD // OPEN SOURCE STL
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-white mt-0.5">
            {title}
          </h3>
        </div>

        {/* GitHub link button */}
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-wider px-3.5 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>VER REPO EN GITHUB</span>
        </a>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative w-full" style={{ height }}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-mono text-xs text-red-400 tracking-widest">
            CARGANDO_PIEZA_3D...
          </div>
        )}

        {/* View Controls Toolbar (Floating inside Canvas) */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Instructions */}
          <div className="bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg font-mono text-[0.62rem] text-zinc-400">
            🖱️ Arrastrar para rotar • Rueda para zoom
          </div>

          {/* Action pills */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`font-mono text-[0.65rem] px-3 py-1.5 rounded-lg border transition-colors ${
                isRotating 
                  ? 'bg-red-600 text-white border-red-500' 
                  : 'bg-black/60 text-zinc-400 border-white/10 hover:text-white'
              }`}
            >
              {isRotating ? '⏸ PAUSAR GIRO' : '▶ AUTO-GIRO'}
            </button>

            <button
              onClick={() => setIsWireframe(!isWireframe)}
              className={`font-mono text-[0.65rem] px-3 py-1.5 rounded-lg border transition-colors ${
                isWireframe 
                  ? 'bg-red-600 text-white border-red-500' 
                  : 'bg-black/60 text-zinc-400 border-white/10 hover:text-white'
              }`}
            >
              {isWireframe ? 'WIREFRAME ON' : 'WIREFRAME'}
            </button>

            {/* Color switcher */}
            <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-2 py-1 rounded-lg">
              <button
                onClick={() => setMaterialColor('#ef4444')}
                className={`w-3.5 h-3.5 rounded-full bg-red-600 ${materialColor === '#ef4444' ? 'ring-2 ring-white' : ''}`}
                title="Rojo XpriT (PLA)"
              />
              <button
                onClick={() => setMaterialColor('#e4e4e7')}
                className={`w-3.5 h-3.5 rounded-full bg-zinc-200 ${materialColor === '#e4e4e7' ? 'ring-2 ring-white' : ''}`}
                title="Blanco Técnico"
              />
              <button
                onClick={() => setMaterialColor('#27272a')}
                className={`w-3.5 h-3.5 rounded-full bg-zinc-800 ${materialColor === '#27272a' ? 'ring-2 ring-white' : ''}`}
                title="Negro Fibra de Carbono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Part Selector Carousel / Buttons */}
      <div className="p-4 sm:p-6 bg-[#0e0f14] border-t border-white/10">
        <div className="font-mono text-[0.65rem] text-zinc-400 tracking-wider uppercase mb-3">
          SELECCIONAR COMPONENTE DE LA ARQUITECTURA:
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {availableParts.map((part, index) => (
            <button
              key={index}
              onClick={() => setSelectedPart(index)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPart === index
                  ? 'bg-red-600/15 border-red-500 text-white shadow-lg shadow-red-600/10'
                  : 'bg-[#14151b] border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
              }`}
            >
              <div className="font-mono text-[0.6rem] text-red-400 font-bold mb-1">
                0{index + 1} // CAD
              </div>
              <div className="font-display font-semibold text-xs leading-snug">
                {part.name}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Part Description */}
        <div className="mt-4 p-3.5 bg-black/40 border border-white/5 rounded-xl flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
          <p className="font-sans text-xs text-zinc-300 leading-relaxed">
            <strong className="text-white font-medium">{availableParts[selectedPart]?.name}: </strong>
            {availableParts[selectedPart]?.description}
          </p>
        </div>
      </div>
    </div>
  )
}
