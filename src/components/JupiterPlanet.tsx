'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── Public interfaces (consumed by Hero) ────────────────────────────────────

export interface CamState {
  posX: number
  posY: number
  posZ: number
  lightX: number
  lightY: number
  lightZ: number
}

export interface MouseState {
  x: number // –1 … +1  (normalized viewport)
  y: number // –1 … +1
}

// ─── Shaders ─────────────────────────────────────────────────────────────────

const PLANET_VERT = `
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vViewPos;
  void main() {
    vUv     = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

const PLANET_FRAG = `
  uniform sampler2D uTexture;
  uniform vec3  uKeyLight;
  uniform vec3  uFillLight;
  uniform float uContrast;
  uniform float uBrightness;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vViewPos;

  float sCurve(float x) {
    x = clamp(x, 0.0, 1.0);
    return x < 0.5
      ? 2.0 * x * x
      : 1.0 - pow(-2.0 * x + 2.0, 2.0) * 0.5;
  }

  void main() {
    vec4  tex  = texture2D(uTexture, vUv);
    float luma = dot(tex.rgb, vec3(0.2126, 0.7152, 0.0722));
    float gray = sCurve((luma - 0.5) * uContrast + 0.5);

    float key  = clamp(dot(vNormal, uKeyLight),  0.0, 1.0);
    float fill = clamp(dot(vNormal, uFillLight), 0.0, 1.0) * 0.15;

    vec3  vd  = normalize(-vViewPos);
    float rim = pow(1.0 - clamp(dot(vNormal, vd), 0.0, 1.0), 5.0) * 0.20;

    float limb  = clamp(dot(vNormal, vd), 0.0, 1.0);
    float light = 0.10 + key * 0.76 + fill + rim;
    float final = clamp(gray * light * uBrightness, 0.0, 1.0);
    final *= 0.74 + 0.26 * limb;

    gl_FragColor = vec4(vec3(final), 1.0);
  }
`

const GLOW_VERT = `
  uniform vec3  uViewVector;
  varying float vIntensity;
  void main() {
    vec3 n = normalize(normalMatrix * normal);
    vec3 v = normalize(normalMatrix * uViewVector);
    vIntensity = 1.0 - abs(dot(n, v));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// ─── Props ───────────────────────────────────────────────────────────────────

export interface JupiterPlanetProps {
  className?: string
  camState?: React.MutableRefObject<CamState>
  mouse?:    React.MutableRefObject<MouseState>
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function JupiterPlanet({
  className = '',
  camState,
  mouse,
}: JupiterPlanetProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth  || 700
    const H = mount.clientHeight || 700

    const isMobile = window.innerWidth < 768
    // On retina screens (dPR ≥ 2) the 2× supersampling already smooths edges;
    // cap at 2 everywhere — going higher wastes GPU without visible gain.
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    // More segments on desktop for a perfectly round silhouette at high DPI
    const segments = isMobile ? 72 : 128

    // ── Scene ──
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 200)
    const initPos = camState?.current
    camera.position.set(initPos?.posX ?? 0, initPos?.posY ?? 0.08, initPos?.posZ ?? 4.0)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,          // MSAA on all devices — essential for clean edges
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(W, H)
    renderer.setPixelRatio(pixelRatio)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Texture ──
    const texture = new THREE.TextureLoader().load('/textures/jupiter.jpg')
    texture.colorSpace  = THREE.SRGBColorSpace
    texture.minFilter   = THREE.LinearMipmapLinearFilter
    texture.magFilter   = THREE.LinearFilter
    texture.anisotropy  = renderer.capabilities.getMaxAnisotropy()

    // ── Planet ──
    const geo = new THREE.SphereGeometry(1, segments, segments)
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture:    { value: texture },
        uKeyLight:   { value: new THREE.Vector3(-1.4, 0.7, 0.8).normalize() },
        uFillLight:  { value: new THREE.Vector3(1.2, -0.5, -0.4).normalize() },
        uContrast:   { value: 1.38 },
        uBrightness: { value: 1.10 },
      },
      vertexShader:   PLANET_VERT,
      fragmentShader: PLANET_FRAG,
    })
    const planet = new THREE.Mesh(geo, mat)
    scene.add(planet)

    // ── Glow — single tight layer on mobile, two on desktop ──
    function makeGlow(radius: number, power: number, alpha: number) {
      const g = new THREE.SphereGeometry(radius, isMobile ? 32 : 48, isMobile ? 32 : 48)
      const m = new THREE.ShaderMaterial({
        uniforms: { uViewVector: { value: camera.position.clone() } },
        vertexShader:   GLOW_VERT,
        fragmentShader: `
          varying float vIntensity;
          void main() {
            float i = pow(vIntensity, ${power.toFixed(1)});
            gl_FragColor = vec4(1.0, 1.0, 1.0, i * ${alpha.toFixed(3)});
          }
        `,
        side: THREE.BackSide, blending: THREE.AdditiveBlending,
        transparent: true, depthWrite: false,
      })
      const mesh = new THREE.Mesh(g, m)
      scene.add(mesh)
      return { mesh, mat: m, geo: g }
    }

    const innerGlow = makeGlow(1.036, 4.0, 0.14)
    const midGlow   = isMobile ? null : makeGlow(1.10, 2.6, 0.036)

    // ── Drag / inertia state ──
    let isDragging   = false
    let lastPointerX = 0
    let dragVelocity = 0
    const DRAG_SENSITIVITY = 0.005
    const INERTIA_DECAY    = 0.88
    const AUTO_ROT_SPEED   = 0.00062

    const hitTest = (cx: number, cy: number): boolean => {
      const rect = mount.getBoundingClientRect()
      const dx = cx - (rect.left + rect.width  * 0.5)
      const dy = cy - (rect.top  + rect.height * 0.5)
      const r  = rect.height * 0.30
      return dx * dx + dy * dy <= r * r
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!hitTest(e.clientX, e.clientY)) return
      isDragging   = true
      lastPointerX = e.clientX
      dragVelocity = 0
      mount.style.cursor = 'grabbing'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      const delta  = e.clientX - lastPointerX
      dragVelocity = delta * DRAG_SENSITIVITY
      rotY        += dragVelocity
      lastPointerX = e.clientX
    }

    const onPointerUp = () => {
      if (!isDragging) return
      isDragging = false
      mount.style.cursor = 'grab'
    }

    const onMountPointerMove = (e: PointerEvent) => {
      if (isDragging) return
      mount.style.cursor = hitTest(e.clientX, e.clientY) ? 'grab' : 'default'
    }

    mount.addEventListener('pointerdown',  onPointerDown)
    mount.addEventListener('pointermove',  onMountPointerMove)
    window.addEventListener('pointermove', onPointerMove,  { passive: true })
    window.addEventListener('pointerup',   onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    // ── Animation state ──
    let frameId: number
    let rotY    = 0
    let smMouseX = 0
    let smMouseY = 0

    let camBaseX = camera.position.x
    let camBaseY = camera.position.y
    let camBaseZ = camera.position.z

    const LERP_CAM   = 0.036
    const LERP_LIGHT = 0.048
    const LERP_MOUSE = 0.055

    // ── Page Visibility: pause rAF when tab is hidden ──
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId)
      } else {
        animate()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // ── rAF loop ──
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const now = Date.now()

      // Rotation: drag → inertia → auto
      if (!isDragging) {
        if (Math.abs(dragVelocity) > 0.00008) {
          dragVelocity *= INERTIA_DECAY
          rotY += dragVelocity
        } else {
          dragVelocity = 0
          rotY += AUTO_ROT_SPEED
        }
      }
      planet.rotation.y         = rotY
      innerGlow.mesh.rotation.y = rotY

      // Subtle breathing (scale) — skip on mobile to save CPU
      if (!isMobile) {
        planet.scale.setScalar(1.0 + Math.sin(now * 0.00042) * 0.0055)
      }

      // Camera lerp toward camState
      if (camState?.current) {
        const { posX, posY, posZ, lightX, lightY, lightZ } = camState.current
        camBaseX += (posX - camBaseX) * LERP_CAM
        camBaseY += (posY - camBaseY) * LERP_CAM
        camBaseZ += (posZ - camBaseZ) * LERP_CAM
        const kl = mat.uniforms.uKeyLight.value as THREE.Vector3
        kl.x += (lightX - kl.x) * LERP_LIGHT
        kl.y += (lightY - kl.y) * LERP_LIGHT
        kl.z += (lightZ - kl.z) * LERP_LIGHT
        kl.normalize()
      }

      // Micro orbital drift — skip on mobile
      if (!isMobile) {
        camera.position.x = camBaseX + Math.sin(now * 0.000092) * 0.020
        camera.position.y = camBaseY + Math.cos(now * 0.000075) * 0.013
        camera.position.z = camBaseZ + Math.sin(now * 0.000060) * 0.026
        camera.fov = 40 + Math.sin(now * 0.000054) * 0.28
        camera.updateProjectionMatrix()
      } else {
        camera.position.x = camBaseX
        camera.position.y = camBaseY
        camera.position.z = camBaseZ
      }

      // Glow pulse — skip on mobile
      if (!isMobile) {
        const glowBreath = 1.0 + Math.sin(now * 0.000248) * 0.014
        innerGlow.mesh.scale.setScalar(glowBreath)
        midGlow?.mesh.scale.setScalar(glowBreath)
      }

      innerGlow.mat.uniforms.uViewVector.value.copy(camera.position)
      midGlow?.mat.uniforms.uViewVector.value.copy(camera.position)

      // Mouse-driven lookAt offset
      if (mouse?.current) {
        smMouseX += (mouse.current.x - smMouseX) * LERP_MOUSE
        smMouseY += (mouse.current.y - smMouseY) * LERP_MOUSE
      }
      // On mobile, look below center so the planet appears higher in the frame
      // without changing camera distance (no size change)
      const lookAtY = smMouseY * 0.07 + (isMobile ? -0.45 : 0)
      camera.lookAt(smMouseX * 0.11, lookAtY, 0)

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ──
    const ro = new ResizeObserver(() => {
      const W = mount.clientWidth
      const H = mount.clientHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(frameId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      ro.disconnect()
      mount.removeEventListener('pointerdown',  onPointerDown)
      mount.removeEventListener('pointermove',  onMountPointerMove)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup',   onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      renderer.dispose()
      const glows = midGlow ? [mat, innerGlow.mat, midGlow.mat] : [mat, innerGlow.mat]
      const geos  = midGlow ? [geo, innerGlow.geo, midGlow.geo] : [geo, innerGlow.geo]
      glows.forEach(m => m.dispose())
      geos.forEach(g => g.dispose())
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [camState, mouse])

  return (
    <div
      ref={mountRef}
      className={`w-full h-full ${className}`}
      style={{ cursor: 'default' }}
      aria-label="Planète interactive — cliquer-glisser pour faire tourner"
    />
  )
}
