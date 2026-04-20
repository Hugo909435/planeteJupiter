import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="section-padding pt-14 pb-10 border-t border-white/5"
      role="contentinfo"
    >
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">

        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-display text-sm tracking-widest uppercase text-white/50 hover:text-white transition-colors duration-400"
          >
            Planète Jupiter
          </Link>
          <p className="mt-2 text-xs text-white/20 font-body">
            Vidéaste &amp; Créateur d&apos;images
          </p>
        </div>

        {/* Nav links */}
        <nav aria-label="Liens du footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 list-none" role="list">
            <li>
              <Link href="/portfolio" className="text-xs tracking-widest uppercase text-white/25 hover:text-white/60 transition-colors duration-400 font-body">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-xs tracking-widest uppercase text-white/25 hover:text-white/60 transition-colors duration-400 font-body">
                Contact
              </Link>
            </li>
            <li>
              <a
                href="https://www.instagram.com/_planetejupiter_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase text-white/25 hover:text-white/60 transition-colors duration-400 font-body"
                aria-label="Instagram Planète Jupiter"
              >
                Instagram
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom row */}
      <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <p className="text-xs text-white/15 font-body">
          &copy; {year} Planète Jupiter. Tous droits réservés.
        </p>
        <ul className="flex gap-6 list-none" role="list">
          <li>
            <Link
              href="/mentions-legales"
              className="text-xs text-white/15 hover:text-white/40 transition-colors duration-400 font-body"
            >
              Mentions légales
            </Link>
          </li>
          <li>
            <Link
              href="/politique-confidentialite"
              className="text-xs text-white/15 hover:text-white/40 transition-colors duration-400 font-body"
            >
              Politique de confidentialité
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
