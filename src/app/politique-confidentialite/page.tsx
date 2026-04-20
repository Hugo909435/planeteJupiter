import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: "Politique de confidentialité et gestion des données personnelles — Planète Jupiter.",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://planetejupiter.fr/politique-confidentialite' },
}

export default function PolitiqueConfidentialitePage() {
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
          Politique de confidentialité
        </h1>

        <div className="space-y-14 font-body text-sm text-white/55 leading-loose">

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              1. Collecte des données
            </h2>
            <p>
              Ce site peut collecter des données personnelles via le formulaire de contact
              et les échanges par email. Les données susceptibles d&apos;être collectées sont :
            </p>
            <ul className="mt-4 space-y-2 pl-4 list-none">
              {['Nom et prénom', 'Adresse email', 'Numéro de téléphone (si renseigné)', 'Message et nature du projet'].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 rounded-full bg-white/25 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="w-10 h-px bg-white/8" aria-hidden="true" />

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              2. Utilisation des données
            </h2>
            <p>Les données collectées sont utilisées exclusivement pour :</p>
            <ul className="mt-4 space-y-2 pl-4 list-none">
              {[
                'Répondre aux demandes de contact et de devis',
                'Établir un échange professionnel',
                'Assurer le suivi des projets en cours',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 rounded-full bg-white/25 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-white/40">
              Aucune donnée personnelle n&apos;est vendue, louée ou cédée à des tiers.
            </p>
          </section>

          <div className="w-10 h-px bg-white/8" aria-hidden="true" />

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              3. Durée de conservation
            </h2>
            <p>
              Les données sont conservées pendant une durée maximale de{' '}
              <strong className="text-white/70 font-normal">3 ans</strong> à compter
              du dernier contact, sauf obligation légale contraire ou demande de suppression
              formulée par l&apos;utilisateur.
            </p>
          </section>

          <div className="w-10 h-px bg-white/8" aria-hidden="true" />

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              4. Droits des utilisateurs (RGPD)
            </h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la
              loi Informatique et Libertés, vous disposez des droits suivants :
            </p>
            <ul className="mt-4 space-y-2 pl-4 list-none">
              {[
                'Droit d\'accès à vos données personnelles',
                'Droit de rectification des données inexactes',
                'Droit à l\'effacement (droit à l\'oubli)',
                'Droit d\'opposition au traitement',
                'Droit à la portabilité des données',
                'Droit à la limitation du traitement',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 rounded-full bg-white/25 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6">
              Pour exercer ces droits, contactez :{' '}
              <a
                href="mailto:contact@planetejupiter.fr"
                className="text-white/70 hover:text-white transition-colors duration-300"
              >
                contact@planetejupiter.fr
              </a>
            </p>
          </section>

          <div className="w-10 h-px bg-white/8" aria-hidden="true" />

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              5. Cookies
            </h2>
            <p>
              Ce site peut utiliser des cookies techniques strictement nécessaires au bon
              fonctionnement des pages (navigation, préférences).
            </p>
            <p className="mt-4">
              Aucun cookie de tracking publicitaire ou d&apos;analyse comportementale avancée
              n&apos;est utilisé sans consentement préalable.
            </p>
            <p className="mt-4 text-white/40">
              En continuant à naviguer sur ce site, vous acceptez l&apos;utilisation des cookies
              techniques indispensables.
            </p>
          </section>

          <div className="w-10 h-px bg-white/8" aria-hidden="true" />

          <section>
            <h2 className="font-body text-xs tracking-widest uppercase text-white/30 mb-5">
              6. Contact
            </h2>
            <p>
              Pour toute question relative à la gestion de vos données personnelles ou pour
              exercer vos droits :
            </p>
            <p className="mt-4">
              <a
                href="mailto:contact@planetejupiter.fr"
                className="text-white/70 hover:text-white transition-colors duration-300"
              >
                contact@planetejupiter.fr
              </a>
            </p>
            <p className="mt-6 text-white/35 text-xs">
              Vous disposez également du droit d&apos;introduire une réclamation auprès de la
              CNIL (Commission Nationale de l&apos;Informatique et des Libertés) —{' '}
              <span className="text-white/50">www.cnil.fr</span>
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
