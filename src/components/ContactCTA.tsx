'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ContactCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact-cta"
      className="section-padding border-t border-white/5"
      style={{ paddingTop: 'var(--space-section-lg)', paddingBottom: 'var(--space-section-lg)' }}
      aria-label="Prendre contact"
    >
      <div ref={innerRef} className="text-center max-w-2xl mx-auto" style={{ opacity: 0 }}>
        <p className="text-xs tracking-widest uppercase text-white/25 mb-8 font-body">
          Votre projet
        </p>

        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6">
          Créons quelque chose
          <br />
          <em className="text-white/50">d'exceptionnel.</em>
        </h2>

        <p className="text-sm text-white/35 font-body leading-loose mb-14 max-w-md mx-auto">
          Mariage, clip, film de marque, événement — chaque histoire mérite une
          image à sa hauteur. Parlez-moi de votre projet.
        </p>

        <Link href="/contact" className="btn-primary text-sm">
          Prendre contact
        </Link>
      </div>
    </section>
  )
}
