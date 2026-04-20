import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'

// Below-fold sections are code-split: their JS only loads when needed
const FeaturedProjects = dynamic(() => import('@/components/FeaturedProjects'))
const Showreel        = dynamic(() => import('@/components/Showreel'))
const About           = dynamic(() => import('@/components/About'))
const ContactCTA      = dynamic(() => import('@/components/ContactCTA'))
const Footer          = dynamic(() => import('@/components/Footer'))

export const metadata: Metadata = {
  title: "Planète Jupiter — Vidéaste & Créateur d'images",
  description:
    "Planète Jupiter, vidéaste et créateur d'images. Films de mariage, clips musicaux, films de marque. Une approche cinématique, minimaliste et haut de gamme.",
  alternates: {
    canonical: 'https://planetejupiter.fr',
  },
}

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <Hero />
      <FeaturedProjects />
      <Showreel />
      <About />
      <ContactCTA />
      <Footer />
    </main>
  )
}
