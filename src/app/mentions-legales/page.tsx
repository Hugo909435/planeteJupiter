import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: "Mentions légales du site Planète Jupiter, vidéaste et créateur d'images.",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://planetejupiter.fr/mentions-legales' },
}

export default function MentionsLegalesPage() {
  return (
    <>
      <Navigation />
      <main
        className="section-padding pt-40 pb-24 max-w-3xl mx-auto"
        style={{ minHeight: '100vh' }}
      >
        <p className="font-body text-xs tracking-widest uppercase text-white/25 mb-8">
          Légal
        </p>
        <h1 className="font-display font-light text-white text-4xl md:text-5xl leading-tight mb-16">
          Mentions légales
        </h1>

        <div className="space-y-14 font-body text-sm text-white/55 leading-loose">

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              1. Éditeur du site
            </h2>
            <div className="space-y-2">
              <p><span className="text-white/40">Nom / Pseudo :</span> Planète Jupiter</p>
              <p><span className="text-white/40">Statut :</span> Vidéaste freelance</p>
              <p><span className="text-white/40">Nom complet :</span> [TON NOM COMPLET]</p>
              <p><span className="text-white/40">Adresse :</span> [VILLE, FRANCE]</p>
              <p>
                <span className="text-white/40">Email :</span>{' '}
                <a
                  href="mailto:contact@planetejupiter.fr"
                  className="text-white/55 hover:text-white transition-colors duration-300"
                >
                  contact@planetejupiter.fr
                </a>
              </p>
            </div>
          </section>

          <div className="w-10 h-px bg-white/8" aria-hidden="true" />

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              2. Hébergement
            </h2>
            <div className="space-y-2">
              <p><span className="text-white/40">Hébergeur :</span> [Vercel / OVH / Hostinger]</p>
              <p><span className="text-white/40">Adresse :</span> [Adresse de l&apos;hébergeur]</p>
              <p><span className="text-white/40">Site web :</span> [URL de l&apos;hébergeur]</p>
            </div>
          </section>

          <div className="w-10 h-px bg-white/8" aria-hidden="true" />

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              3. Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu présent sur ce site — textes, images, vidéos, graphismes,
              logo et identité visuelle — est protégé par le droit de la propriété intellectuelle
              et appartient exclusivement à Planète Jupiter.
            </p>
            <p className="mt-4">
              Toute reproduction, modification, diffusion ou exploitation, totale ou partielle,
              sans autorisation écrite préalable est strictement interdite.
            </p>
          </section>

          <div className="w-10 h-px bg-white/8" aria-hidden="true" />

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              4. Responsabilité
            </h2>
            <p>
              L&apos;éditeur du site s&apos;efforce de fournir des informations aussi précises et à
              jour que possible. Il ne pourra cependant être tenu responsable des omissions,
              inexactitudes ou carences dans la mise à jour des informations diffusées.
            </p>
            <p className="mt-4">
              Les liens hypertextes présents sur ce site peuvent rediriger vers des sites externes.
              Planète Jupiter n&apos;assume aucune responsabilité quant au contenu de ces sites tiers.
            </p>
          </section>

          <div className="w-10 h-px bg-white/8" aria-hidden="true" />

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              5. Données personnelles
            </h2>
            <p>
              Les informations recueillies via ce site (formulaire de contact notamment) sont
              utilisées uniquement dans le cadre des échanges professionnels avec les utilisateurs.
              Elles ne sont ni revendues, ni cédées à des tiers.
            </p>
            <p className="mt-4">
              Pour plus d&apos;informations,{' '}
              <Link
                href="/politique-confidentialite"
                className="text-white/70 hover:text-white transition-colors duration-300 underline underline-offset-4 decoration-white/20"
              >
                consultez notre politique de confidentialité
              </Link>
              .
            </p>
          </section>

        </div>

        <div className="mt-20 pt-10 border-t border-white/5">
          <Link
            href="/"
            className="font-body text-xs tracking-widest uppercase text-white/25 hover:text-white/60 transition-colors duration-300"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
