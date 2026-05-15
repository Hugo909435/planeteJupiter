'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { CamState, MouseState, JupiterPlanetProps } from './JupiterPlanet'

gsap.registerPlugin(ScrollTrigger)

const JupiterPlanet = dynamic<JupiterPlanetProps>(
  () => import('./JupiterPlanet'),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
)

const CAM_INIT: CamState = {
  posX: 0.0,  posY: 0.08,  posZ: 4.0,
  lightX: -1.40, lightY: 0.70, lightZ: 0.80,
}
const CAM_END: CamState = {
  posX: 0.24, posY: -0.02, posZ: 3.1,
  lightX: -0.58, lightY: 0.52, lightZ: 0.98,
}

// Scale camera Z based on viewport width so the planet isn't overwhelming on mobile
function getResponsiveZ(base: number): number {
  if (typeof window === 'undefined') return base
  if (window.innerWidth < 640)  return base * 1.625  // mobile  → ~6.5 / ~5.0
  if (window.innerWidth < 1024) return base * 1.25   // tablet  → ~5.0 / ~3.9
  return base
}

// Lower camera on mobile so the planet sits higher in the frame
function getResponsiveY(base: number): number {
  if (typeof window === 'undefined') return base
  if (window.innerWidth < 640) return base - 0.10
  return base
}

export default function Hero() {
  const sectionRef    = useRef<HTMLElement>(null)
  const planetFrameRef = useRef<HTMLDivElement>(null)
  const planetWrapRef = useRef<HTMLDivElement>(null)
  const textRef       = useRef<HTMLDivElement>(null)
  const subtitleRef   = useRef<HTMLParagraphElement>(null)
  const titleRef      = useRef<HTMLHeadingElement>(null)
  const taglineRef    = useRef<HTMLParagraphElement>(null)
  const ctasRef       = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const overlayRef    = useRef<HTMLDivElement>(null)

  // Initialize with responsive Z/Y so Three.js reads the correct starting position
  const camState = useRef<CamState>({
    ...CAM_INIT,
    posY: getResponsiveY(CAM_INIT.posY),
    posZ: getResponsiveZ(CAM_INIT.posZ),
  })
  const mouse = useRef<MouseState>({ x: 0, y: 0 })

  // Lock scroll until title + tagline have appeared
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Mouse tracking for planet parallax
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    let cleanupPlanetOrbit: (() => void) | undefined

    const ctx = gsap.context(() => {

      // ── ENTRANCE ──
      const tl = gsap.timeline({ delay: 0.4 })

      tl.fromTo(planetWrapRef.current,
        { scaleX: 0.88, scaleY: 0.88 },
        { scaleX: 1, scaleY: 1, duration: 4.5, ease: 'power2.out' }
      )
      .to(overlayRef.current,
        { opacity: 0, duration: 3.8, ease: 'power2.inOut' },
        0.8
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, letterSpacing: '0.55em' },
        { opacity: 1, letterSpacing: '0.30em', duration: 2.2, ease: 'power4.out' },
        '-=2.8'
      )
      .fromTo(titleRef.current,
        { opacity: 0, filter: 'blur(16px)', y: 12 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 2.6, ease: 'power3.out', clearProps: 'filter' },
        '-=1.8'
      )
      .fromTo(taglineRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out' },
        '-=0.9'
      )
      // Scroll unlocks once tagline is visible
      .call(() => {
        document.body.style.overflow = ''
        ScrollTrigger.refresh()
      })
      .fromTo(ctasRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out' },
        '-=1.4'
      )
      // Scroll hint entrance — opacity only; y loop starts separately
      .fromTo(scrollHintRef.current,
        { opacity: 0, y: 0 },
        { opacity: 1, y: 0, duration: 1.4 },
        '-=1.0'
      )
      // After entrance settles, start breathing loop (fade + drift down)
      .call(() => {
        gsap.to(scrollHintRef.current, {
          y: 7,
          opacity: 0.38,
          duration: 1.5,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
        })
      })

      // ── CAMERA ──
      gsap.to(camState.current, {
        posX: CAM_END.posX, posY: getResponsiveY(CAM_END.posY), posZ: getResponsiveZ(CAM_END.posZ),
        lightX: CAM_END.lightX, lightY: CAM_END.lightY, lightZ: CAM_END.lightZ,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top', end: 'bottom top', scrub: 2.4,
        },
      })

      const planetFrame = planetFrameRef.current
      if (planetFrame) {
        const yTo = gsap.quickTo(planetFrame, 'y', { duration: 0.9, ease: 'power3.out' })
        const scaleXTo = gsap.quickTo(planetFrame, 'scaleX', { duration: 1.0, ease: 'power3.out' })
        const scaleYTo = gsap.quickTo(planetFrame, 'scaleY', { duration: 1.0, ease: 'power3.out' })

        const updatePlanetOrbit = () => {
          const scrollY = window.scrollY
          const maxScroll = Math.max(ScrollTrigger.maxScroll(window), 1)
          const vw = window.innerWidth
          const vh = window.innerHeight
          const isSmall = vw < 640

          const visualDiameter = Math.min(vw, vh) * (isSmall ? 0.78 : 0.84)
          const travel = vw + visualDiameter * (isSmall ? 1.35 : 1.55)
          const orbitEdgeX = isSmall ? vw * 0.23 : travel * 0.5
          const orbitLength = vh * (isSmall ? 3.15 : 2.05)
          const verticalDistance = vh * (isSmall ? 0.24 : 0.30)
          const verticalScale = isSmall ? 0.74 : 0.68
          const verticalEnd = vh * (isSmall ? 0.42 : 0.5)
          const handoffLength = vh * 0.18
          const orbitY = vh * (isSmall ? 0.02 : 0.04)
          const orbitStart = verticalEnd + handoffLength
          const finalStart = Math.max(orbitStart + orbitLength * 0.5, maxScroll - vh * (isSmall ? 0.95 : 1.05))
          const finalProgress = gsap.utils.clamp(0, 1, (scrollY - finalStart) / Math.max(maxScroll - finalStart, 1))

          let x = 0
          let y = 0
          let scale = 1
          let opacity = 1

          if (scrollY < verticalEnd) {
            const verticalProgress = gsap.utils.clamp(0, 1, scrollY / verticalEnd)
            const eased = 1 - Math.pow(1 - verticalProgress, 2)

            y = eased * verticalDistance
            scale = gsap.utils.interpolate(1, verticalScale, eased)
            opacity = gsap.utils.interpolate(1, 0.82, eased)
          } else if (scrollY < orbitStart) {
            const handoffProgress = gsap.utils.clamp(0, 1, (scrollY - verticalEnd) / handoffLength)
            const eased = handoffProgress < 0.5
              ? 4 * handoffProgress * handoffProgress * handoffProgress
              : 1 - Math.pow(-2 * handoffProgress + 2, 3) / 2

            x = 0
            y = gsap.utils.interpolate(verticalDistance, orbitY, eased)
            scale = gsap.utils.interpolate(verticalScale, verticalScale * 0.92, eased)
            opacity = gsap.utils.interpolate(0.82, 0.76, eased)
          } else {
            const orbitScroll = scrollY - orbitStart
            const depthProgress = gsap.utils.clamp(0, 1, orbitScroll / Math.max(maxScroll - orbitStart, 1))
            const phase = (orbitScroll / orbitLength) % 1
            const isFirstOrbit = orbitScroll < orbitLength
            const depthOpacity = gsap.utils.interpolate(0.76, 0.42, depthProgress)
            const exitStart = isSmall ? 0.72 : 0.78
            const exitEnd = isSmall ? 0.92 : 0.9
            const enterEnd = isSmall ? 0.2 : 0.12
            const resetStart = exitEnd
            const travelPhase = gsap.utils.clamp(0, 1, phase / exitEnd)
            const wrapOpacity = isFirstOrbit
              ? phase < exitStart
                ? 1
                : phase < exitEnd
                  ? gsap.utils.mapRange(exitStart, exitEnd, 1, 0, phase)
                  : 0
              : phase < enterEnd
                ? gsap.utils.mapRange(0, enterEnd, 0.18, 1, phase)
                : phase < exitStart
                  ? 1
                  : phase < exitEnd
                    ? gsap.utils.mapRange(exitStart, exitEnd, 1, 0, phase)
                    : 0

            x =
              phase < resetStart
                ? gsap.utils.interpolate(isFirstOrbit ? 0 : -orbitEdgeX, orbitEdgeX, travelPhase)
                : -orbitEdgeX
            y = orbitY + depthProgress * vh * (isSmall ? 0.12 : 0.16)
            scale = gsap.utils.interpolate(verticalScale * 0.92, isSmall ? 0.58 : 0.46, depthProgress)
            opacity = depthOpacity * wrapOpacity
          }

          if (finalProgress > 0) {
            const easedFinal = finalProgress < 0.5
              ? 4 * finalProgress * finalProgress * finalProgress
              : 1 - Math.pow(-2 * finalProgress + 2, 3) / 2
            const finalStartX = -orbitEdgeX
            const finalStartY = vh * (isSmall ? 0.02 : 0.04)
            const finalStartScale = isSmall ? 0.58 : 0.5

            x = gsap.utils.interpolate(finalStartX, 0, easedFinal)
            y = gsap.utils.interpolate(finalStartY, 0, easedFinal)
            scale = gsap.utils.interpolate(finalStartScale, isSmall ? 0.64 : 0.56, easedFinal)
            opacity = gsap.utils.interpolate(isSmall ? 0.42 : 0.28, 0.66, easedFinal)
          }

          const planetCenterX = vw * 0.5 + x
          const planetCenterY = vh * 0.5 + y
          const planetRadius = visualDiameter * scale * 0.38
          const occluders = document.querySelectorAll<HTMLElement>('[data-planet-occluder]')
          let imageOverlap = 0

          if (!isSmall) {
            occluders.forEach((occluder) => {
              const rect = occluder.getBoundingClientRect()
              if (rect.bottom <= 0 || rect.top >= vh || rect.right <= 0 || rect.left >= vw) return

              const nearestX = gsap.utils.clamp(rect.left, rect.right, planetCenterX)
              const nearestY = gsap.utils.clamp(rect.top, rect.bottom, planetCenterY)
              const distance = Math.hypot(planetCenterX - nearestX, planetCenterY - nearestY)
              const influence = gsap.utils.clamp(0, 1, 1 - distance / (planetRadius + 120))
              imageOverlap = Math.max(imageOverlap, influence)
            })
          }

          opacity *= gsap.utils.interpolate(1, 0.08, imageOverlap * (1 - finalProgress))

          if (finalProgress >= 0.995) {
            gsap.set(planetFrame, { x: 0, y: 0, scaleX: scale, scaleY: scale, opacity: 0.66 })
          } else {
            gsap.set(planetFrame, { x, opacity })
            yTo(y)
            scaleXTo(scale)
            scaleYTo(scale)
          }
        }

        const orbitTrigger = ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: updatePlanetOrbit,
          onRefresh: updatePlanetOrbit,
        })
        window.addEventListener('resize', updatePlanetOrbit, { passive: true })
        cleanupPlanetOrbit = () => {
          window.removeEventListener('resize', updatePlanetOrbit)
          orbitTrigger.kill()
        }
        updatePlanetOrbit()
      }

      // ── TEXT FADE ──
      gsap.fromTo(textRef.current,
        { opacity: 1, y: 0, immediateRender: false },
        {
          opacity: 0, y: -44, ease: 'power1.in',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top', end: '18% top', scrub: 1.0,
          },
        }
      )

    })

    return () => {
      cleanupPlanetOrbit?.()
      ctx.revert()
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative"
      style={{ height: '175vh' }}
      aria-label="Planète Jupiter — Vidéaste"
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Pure black void */}
        <div className="absolute inset-0 bg-black" style={{ zIndex: 0 }} aria-hidden="true" />

        {/* Planet — fixed background Three.js canvas */}
        <div
          ref={planetFrameRef}
          data-orbiting-planet
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 1, willChange: 'transform, opacity' }}
        >
          <div
            ref={planetWrapRef}
            className="absolute inset-0"
            style={{ willChange: 'transform, opacity' }}
          >
            <JupiterPlanet camState={camState} mouse={mouse} />
          </div>
        </div>

        {/* Film grain — cinematic texture layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            opacity: 0.045,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '160px 160px',
            mixBlendMode: 'overlay',
          }}
          aria-hidden="true"
        />

        {/* Film title card — raised clear of scroll indicator */}
        <div
          ref={textRef}
          className="absolute left-0 right-0 z-10 flex flex-col items-center text-center section-padding"
          style={{ bottom: '120px', willChange: 'transform, opacity' }}
        >
          <p
            ref={subtitleRef}
            className="font-body text-xs uppercase text-white/28 mb-5"
            style={{ opacity: 0, letterSpacing: '0.30em' }}
          >
            Vidéaste &nbsp;&nbsp;/&nbsp;&nbsp; Créateur d&apos;images
          </p>
          <h1
            ref={titleRef}
            className="font-display font-light text-white leading-none mb-4"
            style={{ opacity: 0, fontSize: 'clamp(2.6rem, 6.5vw, 6rem)' }}
          >
            Planète Jupiter
          </h1>
          <p
            ref={taglineRef}
            className="font-body text-white/25 mb-10"
            style={{
              opacity: 0,
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Mariage&nbsp;&nbsp;·&nbsp;&nbsp;Clip musical&nbsp;&nbsp;·&nbsp;&nbsp;Film de marque
          </p>
          <div
            ref={ctasRef}
            className="flex flex-col sm:flex-row items-center gap-5"
            style={{ opacity: 0 }}
          >
            <Link href="/portfolio" className="btn-primary">Voir le portfolio</Link>
            <Link href="/contact" className="btn-ghost">Contact</Link>
          </div>
        </div>

        {/* Scroll indicator — independently anchored at bottom, never touches buttons */}
        <div
          className="absolute z-20 flex flex-col items-center gap-2"
          style={{ bottom: '40px', left: '50%', transform: 'translateX(-50%)' }}
          aria-hidden="true"
        >
          <div ref={scrollHintRef} className="flex flex-col items-center gap-2" style={{ opacity: 0 }}>
            <span
              className="font-body uppercase text-white/22"
              style={{ fontSize: '0.5rem', letterSpacing: '0.30em' }}
            >
              Défiler
            </span>
            <div className="scroll-indicator" />
          </div>
        </div>

        {/* Loader overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ zIndex: 40 }}
          aria-hidden="true"
        />

      </div>
    </section>
  )
}
