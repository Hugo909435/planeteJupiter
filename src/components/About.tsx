'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 76%',
          toggleActions: 'play none none reverse',
        },
      })
      tl.fromTo(contentRef.current,
        { opacity: 0, x: -28 },
        { opacity: 1, x: 0, duration: 1.8, ease: 'power4.out' }
      )
      .fromTo(imageRef.current,
        { opacity: 0, x: 28, scale: 0.97 },
        { opacity: 1, x: 0, scale: 1.0, duration: 1.6, ease: 'power4.out' },
        '-=1.2'
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding"
      style={{ paddingTop: 'var(--space-section-lg)', paddingBottom: 'var(--space-section-lg)' }}
      aria-label="À propos de Planète Jupiter"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Text */}
        <div ref={contentRef} style={{ opacity: 0 }}>
          <p className="text-xs tracking-widest uppercase text-white/25 mb-8 font-body">
            À propos
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-8">
            Une vision.
            <br />
            <em className="text-white/60">Un regard.</em>
          </h2>
          <div className="w-10 h-px bg-white/20 mb-8" aria-hidden="true" />
          <p className="text-sm text-white/50 font-body leading-loose mb-6">
            Je suis vidéaste et créateur d'images. Mon travail se situe à la
            croisée du cinéma et de la photographie — là où chaque plan raconte
            une histoire sans avoir besoin de mots.
          </p>
          <p className="text-sm text-white/35 font-body leading-loose mb-12">
            Basé en France, j'interviens sur des mariages, des projets musicaux,
            des films de marque et des événements. Chaque projet est abordé avec
            la même rigueur : une direction artistique cohérente, une image
            maîtrisée, une émotion authentique.
          </p>
          <Link href="/contact" className="btn-primary">
            Discutons de votre projet
          </Link>
        </div>

        {/* Image placeholder */}
        <div
          ref={imageRef}
          className="relative aspect-[3/4]"
          style={{ opacity: 0 }}
          role="img"
          aria-label="Portrait du vidéaste"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(160deg, #111 0%, #1a1a1a 50%, #0d0d0d 100%)',
            }}
          />
          {/* Replace this div with an actual portrait image */}
          <div className="absolute inset-0 flex items-end p-8">
            <p className="text-xs text-white/20 font-body tracking-wider">
              Portrait à venir
            </p>
          </div>
          <div
            className="absolute inset-0 border border-white/5"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}
