'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Manifeste() {
  const sectionRef    = useRef<HTMLElement>(null)
  const tagRef        = useRef<HTMLParagraphElement>(null)
  const ruleRef       = useRef<HTMLDivElement>(null)
  const textLinesRef  = useRef<(HTMLParagraphElement | null)[]>([])
  const signatureRef  = useRef<HTMLParagraphElement>(null)

  const lines = [
    'Chaque projet est une planète à part entière.',
    "Un univers de lumière, de mouvement et d'émotion.",
    "Je filme ce qui mérite d'être vu.",
    'Je révèle ce qui ne se voit pas encore.',
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 76%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.fromTo(tagRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }
      )
      .fromTo(ruleRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.0, ease: 'power2.out', transformOrigin: 'left' },
        '-=0.5'
      )

      // Lines: opacity + y only — blur is expensive on mobile with no visible gain
      lines.forEach((_, i) => {
        const el = textLinesRef.current[i]
        if (!el) return
        tl.fromTo(el,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: i < 2 ? 1.6 : 1.3, ease: 'power4.out' },
          `-=${i === 0 ? 0.5 : 1.1}`
        )
      })

      tl.fromTo(signatureRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: 'power2.out' },
        '-=0.9'
      )
    })

    return () => ctx.revert()
  }, [lines.length])

  return (
    <section
      ref={sectionRef}
      id="manifeste"
      className="section-padding"
      style={{ paddingTop: 'var(--space-section-lg)', paddingBottom: 'var(--space-section-lg)' }}
      aria-label="Manifeste"
    >
      <div className="max-w-4xl mx-auto">

        <p
          ref={tagRef}
          className="font-body text-xs tracking-widest uppercase text-white/20 mb-7"
          style={{ opacity: 0 }}
        >
          Manifeste
        </p>

        <div
          ref={ruleRef}
          className="w-10 h-px bg-white/18 mb-12"
          style={{ opacity: 0, transform: 'scaleX(0)' }}
          aria-hidden="true"
        />

        <h2 className="sr-only">Notre philosophie</h2>

        <div className="space-y-5 md:space-y-7">
          {lines.map((line, i) => (
            <p
              key={i}
              ref={(el) => { textLinesRef.current[i] = el }}
              className="font-display font-light text-white/90 leading-tight"
              style={{
                fontSize: 'clamp(1.85rem, 3.8vw, 3.4rem)',
                opacity: 0,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <p
          ref={signatureRef}
          className="mt-14 font-body text-xs tracking-widest uppercase text-white/20"
          style={{ opacity: 0 }}
        >
          — Planète Jupiter
        </p>
      </div>
    </section>
  )
}
