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
    const ctx = gsap.context(() => {

      // ── ENTRANCE ──
      const tl = gsap.timeline({ delay: 0.4 })

      tl.fromTo(planetWrapRef.current,
        { scale: 0.88 },
        { scale: 1, duration: 4.5, ease: 'power2.out' }
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

      // ── TEXT FADE ──
      gsap.fromTo(textRef.current,
        { opacity: 1, y: 0, immediateRender: false },
        {
          opacity: 0, y: -44, ease: 'power1.in',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top', end: '26% top', scrub: 1.4,
          },
        }
      )

      // ── PLANET FADE ──
      gsap.fromTo(planetWrapRef.current,
        { opacity: 1, immediateRender: false },
        {
          opacity: 0, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '85% top', end: 'bottom top', scrub: 1.0,
          },
        }
      )

    })

    return () => {
      ctx.revert()
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative"
      style={{ height: '250vh' }}
      aria-label="Planète Jupiter — Vidéaste"
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Pure black void */}
        <div className="absolute inset-0 bg-black" aria-hidden="true" />

        {/* Planet — full viewport Three.js canvas */}
        <div
          ref={planetWrapRef}
          className="absolute inset-0"
          style={{ willChange: 'transform, opacity' }}
        >
          <JupiterPlanet camState={camState} mouse={mouse} />
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

        {/* Vignette — edge darkening */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 4,
            background: 'radial-gradient(ellipse 120% 120% at 50% 48%, transparent 28%, rgba(0,0,0,0.82) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom depth gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            zIndex: 4,
            height: '38%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
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
