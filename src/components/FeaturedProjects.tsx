'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: number
  title: string
  category: string
  description: string
  year: string
  textStyle: 'overlay' | 'below'
}

const projects: Project[] = [
  {
    id: 1, title: 'Les Deux Mondes',  category: 'Mariage',
    description: 'Un film intimiste en Bretagne. Lumières naturelles, moments suspendus.',
    year: '2024', textStyle: 'overlay',
  },
  {
    id: 2, title: 'Cosmos', category: 'Clip musical',
    description: "Direction artistique épurée. Noir, blanc, abstraction d'un monde intérieur.",
    year: '2024', textStyle: 'below',
  },
  {
    id: 3, title: 'La Maison Brune', category: 'Film de marque',
    description: "Identité visuelle d'une maison de couture parisienne. Intemporel.",
    year: '2023', textStyle: 'overlay',
  },
]

const LAYOUT = [
  { cols: 'md:col-span-5', aspect: 'aspect-[2/3]',  offset: '',        depth: 'far'  },
  { cols: 'md:col-span-7', aspect: 'aspect-[3/2]',  offset: 'md:mt-28', depth: 'near' },
  { cols: 'md:col-span-12',aspect: 'aspect-[21/9]', offset: 'md:-mt-4', depth: 'near' },
]

interface CardProps { project: Project; index: number }

function ProjectCard({ project, index }: CardProps) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const imgRef   = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { depth } = LAYOUT[index]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isFar = depth === 'far'

      // Card reveal — opacity + y + scale only (no blur: too expensive on mobile)
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: isFar ? 64 : 48, scale: isFar ? 0.93 : 0.97 },
        {
          opacity: 1, y: 0, scale: 1.0,
          duration: isFar ? 1.9 : 1.6,
          ease: 'power4.out',
          delay: index * 0.14,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Parallax on desktop only — 3 simultaneous scrubs on mobile kills scroll performance
      if (window.innerWidth >= 768) {
        gsap.fromTo(
          imgRef.current,
          { scale: 1.08, y: -10 },
          {
            scale: 1.0, y: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top bottom', end: 'bottom top', scrub: 2.2,
            },
          }
        )
      }
    })
    return () => ctx.revert()
  }, [index, depth])

  const { cols, aspect, offset } = LAYOUT[index]
  const gradient = `linear-gradient(${115 + index * 32}deg, #070707 0%, #151515 42%, #0b0b0b 100%)`

  return (
    <div
      ref={cardRef}
      className={`group ${cols} ${offset}`}
      style={{ opacity: 0, willChange: 'transform, opacity' }}
    >
      {/* ── Image ── */}
      <div
        className={`portfolio-card overflow-hidden w-full ${aspect}`}
        role="img"
        aria-label={`${project.title} — ${project.category}`}
      >
        <div
          ref={imgRef}
          className="absolute inset-0"
          style={{ background: gradient, transform: 'scale(1.08) translateY(-10px)' }}
        />

        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
            mixBlendMode: 'overlay',
          }}
          aria-hidden="true"
        />

        <div className="portfolio-card-overlay" />

        <span className="absolute top-5 left-6 font-body text-xs text-white/14 tracking-widest" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="absolute top-5 right-6 font-body text-xs text-white/14" aria-hidden="true">
          {project.year}
        </span>

        <div
          className="absolute bottom-5 right-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700"
          aria-hidden="true"
        >
          <span className="font-body text-sm text-white/45">→</span>
        </div>

        {project.textStyle === 'overlay' && (
          <div
            className="absolute bottom-0 left-0 right-0 p-7 md:p-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-700"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.32) 52%, transparent 100%)' }}
          >
            <p className="category-tag mb-2.5">{project.category}</p>
            <h3
              ref={titleRef}
              className="font-display font-light text-white leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}
            >
              {project.title}
            </h3>
          </div>
        )}
      </div>

      {project.textStyle === 'below' && (
        <div className="pt-5 md:pt-6 flex items-start justify-between gap-4">
          <div>
            <p className="category-tag mb-2">{project.category}</p>
            <h3
              ref={titleRef}
              className="font-display font-light text-white/88 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-700 leading-snug mb-2"
              style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2rem)' }}
            >
              {project.title}
            </h3>
            <p className="font-body text-xs text-white/28 leading-relaxed max-w-sm">
              {project.description}
            </p>
          </div>
          <span
            className="font-body text-white/18 group-hover:text-white/45 transition-colors duration-700 flex-shrink-0 mt-1"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      )}
    </div>
  )
}

export default function FeaturedProjects() {
  const sectionRef  = useRef<HTMLElement>(null)
  const tagRef      = useRef<HTMLParagraphElement>(null)
  const headRef     = useRef<HTMLHeadingElement>(null)
  const linkRef     = useRef<HTMLAnchorElement>(null)
  const ruleRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
      tl.fromTo(tagRef.current,  { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' })
        .fromTo(ruleRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.0, ease: 'power2.out', transformOrigin: 'left' }, '-=0.5')
        .fromTo(headRef.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.8, ease: 'power4.out' }, '-=0.7')
        .fromTo(linkRef.current, { opacity: 0 }, { opacity: 1, duration: 1.0 }, '-=1.0')
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projets"
      className="section-padding"
      style={{ paddingTop: 'var(--space-section-lg)', paddingBottom: 'var(--space-section-lg)' }}
      aria-label="Projets mis en avant"
    >
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div>
          <p ref={tagRef} className="font-body text-xs tracking-widest uppercase text-white/20 mb-5" style={{ opacity: 0 }}>
            Projets
          </p>
          <div ref={ruleRef} className="w-10 h-px bg-white/18 mb-6" style={{ opacity: 0, transform: 'scaleX(0)' }} aria-hidden="true" />
          <h2
            ref={headRef}
            className="font-display font-light text-white leading-none"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.8rem)', opacity: 0 }}
          >
            Quelques univers
          </h2>
        </div>
        <Link
          ref={linkRef}
          href="/portfolio"
          className="hidden md:flex items-center gap-2 font-body text-xs tracking-widest uppercase text-white/24 hover:text-white transition-colors duration-600 group"
          style={{ opacity: 0 }}
        >
          Tout voir
          <span className="group-hover:translate-x-1 transition-transform duration-500" aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-5 gap-y-10 md:gap-y-4">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      <div className="mt-14 md:hidden">
        <Link href="/portfolio" className="btn-ghost text-sm">
          Voir tout le portfolio
        </Link>
      </div>
    </section>
  )
}
