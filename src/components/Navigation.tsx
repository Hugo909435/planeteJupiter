'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    gsap.fromTo(
      nav,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.4 }
    )
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : ''
        }`}
        style={{ opacity: 0 }}
      >
        <nav
          className="section-padding flex items-center justify-between py-6"
          aria-label="Navigation principale"
        >
          <Link
            href="/"
            className="font-display text-sm tracking-widest uppercase text-white/80 hover:text-white transition-colors duration-300"
            aria-label="Planète Jupiter — Accueil"
          >
            Planète Jupiter
          </Link>

          {/* Desktop links + Instagram */}
          <ul className="hidden md:flex items-center gap-10 list-none" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`nav-link ${pathname === href ? 'active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://www.instagram.com/_planetejupiter_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Planète Jupiter"
                className="flex items-center text-white hover:opacity-70 transition-opacity duration-500"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            </li>
          </ul>

          {/* Mobile: Instagram + burger */}
          <div className="md:hidden flex items-center gap-5">
            <a
              href="https://www.instagram.com/_planetejupiter_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Planète Jupiter"
              className="flex items-center text-white hover:opacity-70 transition-opacity duration-500"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
            >
              <span className="block w-5 h-px bg-white/60" />
              <span className="block w-5 h-px bg-white/60" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Menu mobile"
        >
          <button
            className="absolute top-6 right-8 text-white/40 hover:text-white transition-colors text-xs tracking-widest uppercase"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            Fermer
          </button>
          <nav>
            <ul className="flex flex-col items-center gap-10 list-none" role="list">
              <li>
                <Link
                  href="/"
                  className="font-display text-4xl text-white/80 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Accueil
                </Link>
              </li>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-display text-4xl text-white/80 hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="absolute bottom-8 flex flex-col items-center gap-4">
            <a
              href="https://www.instagram.com/_planetejupiter_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Planète Jupiter"
              className="flex items-center text-white/30 hover:text-white/70 transition-colors duration-500"
              onClick={() => setMenuOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <p className="text-xs tracking-widest text-white/20 uppercase">
              Planète Jupiter
            </p>
          </div>
        </div>
      )}
    </>
  )
}
