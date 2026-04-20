'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Showreel() {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      })
      // Header text blur-reveals as a climax moment
      tl.fromTo(
        sectionRef.current?.querySelector('.showreel-header') ?? null,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power4.out' }
      )
      // Video block approaches from depth
      .fromTo(
        wrapRef.current,
        { opacity: 0, scale: 0.94, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 2.0, ease: 'power4.out' },
        '-=1.2'
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="showreel"
      className="section-padding"
      style={{ paddingTop: 'var(--space-section-lg)', paddingBottom: 'var(--space-section-lg)' }}
      aria-label="Showreel"
    >
      <div className="showreel-header mb-12 md:mb-16" style={{ opacity: 0 }}>
        <p className="font-body text-xs tracking-widest uppercase text-white/20 mb-5">
          Showreel
        </p>
        <div className="w-10 h-px bg-white/18 mb-6" aria-hidden="true" />
        <h2
          className="font-display font-light text-white leading-none"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4.8rem)' }}
        >
          L'image en mouvement
        </h2>
      </div>

      <div
        ref={wrapRef}
        className="relative w-full cursor-pointer group"
        style={{ opacity: 0, aspectRatio: '16/9' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        aria-label="Lancer le showreel Planète Jupiter"
        tabIndex={0}
      >
        {/* Poster image */}
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/showreel-poster/1920/1080"
            alt="Showreel Planète Jupiter"
            fill
            className="object-cover"
            sizes="100vw"
            loading="lazy"
          />
          {/* Dark overlay so play button stays lisible */}
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        </div>

        {/* Play button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 flex items-center justify-center transition-all duration-700 ${
              hovered ? 'scale-110 border-white/60 bg-white/5' : 'scale-100'
            }`}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white ml-1 opacity-70"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="mt-6 text-xs tracking-widest uppercase text-white/25 font-body">
            Showreel 2024
          </p>
        </div>

        {/* Corner labels */}
        <div
          className="absolute top-5 left-5 text-xs text-white/20 font-body tracking-wider"
          aria-hidden="true"
        >
          Planète Jupiter
        </div>
        <div
          className="absolute bottom-5 right-5 text-xs text-white/20 font-body tracking-wider"
          aria-hidden="true"
        >
          2024
        </div>

        {/* Border hover effect */}
        <div
          className={`absolute inset-0 border transition-all duration-700 ${
            hovered ? 'border-white/15' : 'border-white/5'
          }`}
          aria-hidden="true"
        />
      </div>

      <p className="mt-8 text-sm text-white/25 font-body leading-relaxed max-w-lg">
        Une sélection de travaux réalisés entre 2020 et 2024. Mariages, clips,
        films de marque — une seule constante : l'image comme langage.
      </p>
    </section>
  )
}
