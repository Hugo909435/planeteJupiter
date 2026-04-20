import type { Metadata } from 'next'
import { Cormorant, Inter } from 'next/font/google'
import './globals.css'
import TarteaucitronInit from '@/components/TarteaucitronInit'

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://planetejupiter.fr'),
  title: {
    default: "Planète Jupiter — Vidéaste & Créateur d'images",
    template: '%s | Planète Jupiter',
  },
  description:
    "Planète Jupiter, vidéaste et créateur d'images basé en France. Films de mariage, clips musicaux, films de marque et événements corporatifs. Une approche cinématique, minimaliste et haut de gamme.",
  keywords: [
    'vidéaste',
    'videaste mariage',
    'filmeur mariage',
    'clip musical',
    'film de marque',
    'cinématographe',
    'créateur de contenu vidéo',
    'Planète Jupiter',
    'videaste professionnel France',
  ],
  authors: [{ name: 'Planète Jupiter' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://planetejupiter.fr',
    siteName: 'Planète Jupiter',
    title: "Planète Jupiter — Vidéaste & Créateur d'images",
    description:
      'Films de mariage, clips musicaux et films de marque. Une vision cinématique, minimaliste et haut de gamme.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Planète Jupiter — Vidéaste',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Planète Jupiter — Vidéaste & Créateur d'images",
    description: 'Films de mariage, clips musicaux et films de marque.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Planète Jupiter',
  description:
    "Vidéaste et créateur d'images spécialisé dans les films de mariage, clips musicaux, films de marque et événements.",
  url: 'https://planetejupiter.fr',
  image: 'https://planetejupiter.fr/og-image.jpg',
  priceRange: '€€€',
  serviceType: [
    'Vidéaste mariage',
    'Réalisateur clip musical',
    'Film de marque',
    'Événementiel',
  ],
  areaServed: {
    '@type': 'Country',
    name: 'France',
  },
  sameAs: ['https://www.instagram.com/_planetejupiter_'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-white font-body antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        <TarteaucitronInit />
      </body>
    </html>
  )
}
