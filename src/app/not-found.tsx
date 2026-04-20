import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="section-padding min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-xs tracking-widest uppercase text-white/20 mb-6 font-body">
          404
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-light text-white mb-6">
          Page introuvable
        </h1>
        <p className="text-sm text-white/35 font-body mb-12">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </main>
      <Footer />
    </>
  )
}
