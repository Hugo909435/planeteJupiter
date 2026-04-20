'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: number
  title: string
  category: string
  categorySlug: string
  description: string
  year: string
  image: string
  // Editorial layout config — ignored when filtered
  cols: string      // tailwind col-span (desktop)
  aspect: string    // aspect-ratio class
  offset: string    // vertical offset class
  textPos: 'overlay' | 'below'
}

const allProjects: Project[] = [
  {
    id: 1,
    title: 'Les Deux Mondes',
    category: 'Mariage',
    categorySlug: 'mariage',
    description: 'Un film de mariage intimiste en Bretagne. Lumières naturelles, moments suspendus.',
    year: '2024',
    image: 'https://picsum.photos/seed/pj-01/1200/900',
    cols:    'md:col-span-7',
    aspect:  'aspect-[4/3]',
    offset:  '',
    textPos: 'below',
  },
  {
    id: 2,
    title: 'Cosmos',
    category: 'Clip musical',
    categorySlug: 'clip',
    description: 'Direction artistique épurée. Noir, blanc, abstraction pure.',
    year: '2024',
    image: 'https://picsum.photos/seed/pj-02/700/1050',
    cols:    'md:col-span-5',
    aspect:  'aspect-[2/3]',
    offset:  'md:mt-20',
    textPos: 'overlay',
  },
  {
    id: 3,
    title: 'La Maison Brune',
    category: 'Film de marque',
    categorySlug: 'corporate',
    description: "Identité visuelle d'une maison de couture parisienne. Intemporel.",
    year: '2023',
    image: 'https://picsum.photos/seed/pj-03/750/1000',
    cols:    'md:col-span-4',
    aspect:  'aspect-[3/4]',
    offset:  '',
    textPos: 'below',
  },
  {
    id: 4,
    title: 'Premier Regard',
    category: 'Mariage',
    categorySlug: 'mariage',
    description: 'Cérémonie au Château de Vaux-le-Vicomte. Élégance absolue.',
    year: '2023',
    image: 'https://picsum.photos/seed/pj-04/1600/1000',
    cols:    'md:col-span-8',
    aspect:  'aspect-[16/10]',
    offset:  'md:mt-10',
    textPos: 'overlay',
  },
  {
    id: 5,
    title: 'Minuit à Paris',
    category: 'Événement',
    categorySlug: 'evenement',
    description: 'Soirée de gala. Atmosphère nocturne, lumières rares.',
    year: '2023',
    image: 'https://picsum.photos/seed/pj-05/2100/900',
    cols:    'md:col-span-12',
    aspect:  'aspect-[21/9]',
    offset:  '',
    textPos: 'overlay',
  },
  {
    id: 6,
    title: 'Orbite',
    category: 'Clip musical',
    categorySlug: 'clip',
    description: 'Abstraction visuelle pour un duo électro parisien.',
    year: '2022',
    image: 'https://picsum.photos/seed/pj-06/800/1000',
    cols:    'md:col-span-5',
    aspect:  'aspect-[4/5]',
    offset:  'md:mt-16',
    textPos: 'below',
  },
  {
    id: 7,
    title: 'Solstice',
    category: 'Mariage',
    categorySlug: 'mariage',
    description: "Mariage dans le Luberon. Lumière d'été, douceur absolue.",
    year: '2022',
    image: 'https://picsum.photos/seed/pj-07/1200/800',
    cols:    'md:col-span-7',
    aspect:  'aspect-[3/2]',
    offset:  '',
    textPos: 'below',
  },
  {
    id: 8,
    title: 'Territoire',
    category: 'Film de marque',
    categorySlug: 'corporate',
    description: 'Film pour une maison de vins de Bourgogne. Lenteur et profondeur.',
    year: '2022',
    image: 'https://picsum.photos/seed/pj-08/2100/900',
    cols:    'md:col-span-12',
    aspect:  'aspect-[16/7]',
    offset:  '',
    textPos: 'overlay',
  },
]

const categories = [
  { slug: 'all', label: 'Tous' },
  { slug: 'mariage', label: 'Mariage' },
  { slug: 'evenement', label: 'Événements' },
  { slug: 'clip', label: 'Clips' },
  { slug: 'corporate', label: 'Corporate' },
]

// ─── Card ────────────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  editorial,
}: {
  project: Project
  index: number
  editorial: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: 'power4.out',
          delay: editorial ? (index % 2) * 0.14 : (index % 3) * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Parallax on desktop only
      if (window.innerWidth >= 768) {
        gsap.fromTo(
          imgRef.current,
          { scale: 1.07, y: -8 },
          {
            scale: 1.0,
            y: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top bottom',
              end:   'bottom top',
              scrub: 2.4,
            },
          }
        )
      }
    })
    return () => ctx.revert()
  }, [index, editorial])

  // In editorial mode use the project's own sizing; in filtered mode use a uniform 2-col grid
  const colClass    = editorial ? project.cols    : 'md:col-span-6'
  const aspectClass = editorial ? project.aspect  : (index % 3 === 0 ? 'aspect-[3/4]' : index % 3 === 1 ? 'aspect-[4/5]' : 'aspect-[16/9]')
  const offsetClass = editorial ? project.offset  : ''
  const textPos     = editorial ? project.textPos : 'below'

  return (
    <article
      ref={cardRef}
      className={`group ${colClass} ${offsetClass}`}
      style={{ opacity: 0 }}
    >
      {/* Image */}
      <div className={`portfolio-card w-full ${aspectClass}`}>
        <div
          ref={imgRef}
          className="absolute inset-0 img-inner"
          style={{ transform: 'scale(1.07) translateY(-8px)' }}
        >
          <Image
            src={project.image}
            alt={`${project.title} — ${project.category}`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            loading="lazy"
          />
        </div>
        <div className="portfolio-card-overlay" />

        <span
          className="absolute top-5 left-5 font-body text-xs text-white/15 tracking-widest"
          aria-hidden="true"
        >
          {String(project.id).padStart(2, '0')}
        </span>
        <span
          className="absolute top-5 right-5 font-body text-xs text-white/15"
          aria-hidden="true"
        >
          {project.year}
        </span>

        {/* Arrow */}
        <div
          className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-1 group-hover:translate-x-0"
          aria-hidden="true"
        >
          <span className="font-body text-sm text-white/50">→</span>
        </div>

        {/* Overlay text */}
        {textPos === 'overlay' && (
          <div
            className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.28) 55%, transparent 100%)',
            }}
          >
            <p className="category-tag mb-2">{project.category}</p>
            <h3 className="font-display text-xl md:text-2xl font-light text-white leading-snug">
              {project.title}
            </h3>
          </div>
        )}
      </div>

      {/* Below text */}
      {textPos === 'below' && (
        <div className="pt-4 md:pt-5 space-y-1.5">
          <p className="category-tag">{project.category}</p>
          <h3 className="font-display text-xl md:text-2xl font-light text-white/88 group-hover:text-white transition-colors duration-700 leading-snug">
            {project.title}
          </h3>
          <p className="font-body text-xs text-white/28 leading-relaxed max-w-xs">
            {project.description}
          </p>
        </div>
      )}
    </article>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const heroRef    = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLElement>(null)

  const editorial = activeCategory === 'all'
  const filtered  = editorial
    ? allProjects
    : allProjects.filter((p) => p.categorySlug === activeCategory)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })
      tl.fromTo(
        heroRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power4.out' }
      )
      .fromTo(
        filtersRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=1.0'
      )
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!gridRef.current) return
    gsap.fromTo(
      gridRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    ScrollTrigger.refresh()
  }, [activeCategory])

  return (
    <>
      <Navigation />
      <main>

        {/* ── Hero ── */}
        <section
          className="section-padding border-b border-white/5"
          style={{ paddingTop: 'clamp(7rem, 14vw, 11rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}
          aria-label="En-tête du portfolio"
        >
          <div ref={heroRef} style={{ opacity: 0 }}>
            <p className="font-body text-xs tracking-widest uppercase text-white/22 mb-8">
              Portfolio
            </p>
            <h1 className="font-display font-light text-white leading-none mb-8"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
              Mes travaux
            </h1>
            <p className="font-body text-sm text-white/38 max-w-lg leading-loose">
              Une sélection de films réalisés entre 2020 et 2024.
              Mariages, clips, films institutionnels —
              chaque projet, une vision singulière.
            </p>
          </div>
        </section>

        {/* ── Filters ── */}
        <nav
          ref={filtersRef}
          className="section-padding border-b border-white/5"
          style={{ paddingTop: '2rem', paddingBottom: '2rem', opacity: 0 }}
          aria-label="Filtres par catégorie"
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-3 list-none" role="list">
            {categories.map(({ slug, label }) => {
              const count =
                slug === 'all'
                  ? allProjects.length
                  : allProjects.filter((p) => p.categorySlug === slug).length
              return (
                <li key={slug}>
                  <button
                    onClick={() => setActiveCategory(slug)}
                    className={`font-body text-xs tracking-widest uppercase transition-colors duration-500 flex items-baseline gap-2 ${
                      activeCategory === slug
                        ? 'text-white'
                        : 'text-white/24 hover:text-white/55'
                    }`}
                    aria-pressed={activeCategory === slug}
                  >
                    {label}
                    <span className="text-white/18 text-[0.6rem]">{count}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* ── Grid ── */}
        <section
          className="section-padding"
          style={{ paddingTop: 'clamp(4rem, 8vw, 7rem)', paddingBottom: 'clamp(4rem, 8vw, 7rem)' }}
          aria-label="Galerie de projets"
        >
          <div
            ref={gridRef}
            className={`grid grid-cols-1 ${
              editorial
                ? 'md:grid-cols-12 gap-x-5 gap-y-10 md:gap-y-6'
                : 'md:grid-cols-12 gap-x-5 gap-y-14'
            }`}
          >
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                editorial={editorial}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center font-body text-sm text-white/22 py-24">
              Aucun projet dans cette catégorie pour le moment.
            </p>
          )}
        </section>

        {/* ── CTA ── */}
        <section
          className="section-padding text-center border-t border-white/5"
          style={{ paddingTop: 'clamp(4rem, 8vw, 6rem)', paddingBottom: 'clamp(4rem, 8vw, 6rem)' }}
          aria-label="Prendre contact"
        >
          <p className="font-body text-xs text-white/25 tracking-widest uppercase mb-8">
            Votre projet
          </p>
          <Link href="/contact" className="btn-primary">
            Parlons-en
          </Link>
        </section>

      </main>
      <Footer />
    </>
  )
}
