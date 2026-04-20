'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type FormState = 'idle' | 'sending' | 'success' | 'error'

const projectTypes = [
  'Mariage',
  'Clip musical',
  'Film de marque',
  'Événement',
  'Autre',
]

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, setFormState] = useState<FormState>('idle')
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: 0.3 }
      )
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: 0.6 }
      )
    })
    return () => ctx.revert()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')
    // Simulate async submission — wire to your backend or a service like Resend
    await new Promise((r) => setTimeout(r, 1200))
    setFormState('success')
  }

  return (
    <>
      <Navigation />

      <main>
        {/* Hero */}
        <section
          className="section-padding pt-40 pb-20 border-b border-white/5"
          aria-label="Page de contact"
        >
          <div ref={heroRef} style={{ opacity: 0 }}>
            <p className="text-xs tracking-widest uppercase text-white/25 mb-6 font-body">
              Contact
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-none mb-8">
              Parlons de votre
              <br />
              <em className="text-white/50">projet.</em>
            </h1>
            <p className="text-sm text-white/40 font-body max-w-md leading-loose">
              Chaque beau projet commence par une conversation. Décrivez-moi
              votre vision, je vous répondrai dans les 48&nbsp;h.
            </p>
          </div>
        </section>

        {/* Form + info */}
        <section
          className="section-padding py-20 md:py-32"
          aria-label="Formulaire de contact"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
            {/* Contact info */}
            <div className="space-y-12">
              <div>
                <p className="text-xs tracking-widest uppercase text-white/25 mb-4 font-body">
                  Disponibilités
                </p>
                <p className="text-sm text-white/40 font-body leading-loose">
                  Actuellement disponible.
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest uppercase text-white/25 mb-4 font-body">
                  Zone d'intervention
                </p>
                <p className="text-sm text-white/40 font-body leading-loose">
                  France.
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest uppercase text-white/25 mb-4 font-body">
                  Email direct
                </p>
                <a
                  href="mailto:contact@planetejupiter.fr"
                  className="text-sm text-white/60 font-body hover:text-white transition-colors duration-300"
                >
                  contact@planetejupiter.fr
                </a>
              </div>

              <div className="w-10 h-px bg-white/10" aria-hidden="true" />

              <div>
                <p className="text-xs tracking-widest uppercase text-white/20 font-body mb-4">
                  Réseaux
                </p>
                <a
                  href="https://www.instagram.com/_planetejupiter_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-wider text-white/25 hover:text-white/60 transition-colors font-body uppercase"
                  aria-label="Instagram de Planète Jupiter"
                >
                  Instagram
                </a>
              </div>
            </div>

            {/* Form */}
            <div>
              {formState === 'success' ? (
                <div className="py-20 text-center">
                  <div className="w-10 h-px bg-white/20 mx-auto mb-8" aria-hidden="true" />
                  <p className="font-display text-3xl font-light text-white mb-4">
                    Message envoyé.
                  </p>
                  <p className="text-sm text-white/35 font-body">
                    Je vous répondrai dans les 48 heures.
                  </p>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                  style={{ opacity: 0 }}
                  noValidate
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-xs tracking-widest uppercase text-white/30 font-body"
                      >
                        Nom *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={values.name}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/15 focus:border-white/40 py-3 text-sm text-white/80 outline-none transition-colors duration-300 font-body placeholder:text-white/15"
                        placeholder="Votre nom"
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-xs tracking-widest uppercase text-white/30 font-body"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={values.email}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/15 focus:border-white/40 py-3 text-sm text-white/80 outline-none transition-colors duration-300 font-body placeholder:text-white/15"
                        placeholder="votre@email.fr"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="text-xs tracking-widest uppercase text-white/30 font-body"
                      >
                        Téléphone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/15 focus:border-white/40 py-3 text-sm text-white/80 outline-none transition-colors duration-300 font-body placeholder:text-white/15"
                        placeholder="+33 6 00 00 00 00"
                        autoComplete="tel"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="projectType"
                        className="text-xs tracking-widest uppercase text-white/30 font-body"
                      >
                        Type de projet
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={values.projectType}
                        onChange={handleChange}
                        className="w-full bg-black border-b border-white/15 focus:border-white/40 py-3 text-sm text-white/80 outline-none transition-colors duration-300 font-body cursor-pointer appearance-none"
                      >
                        <option value="" disabled>
                          Sélectionner...
                        </option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type} className="bg-black">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-xs tracking-widest uppercase text-white/30 font-body"
                    >
                      Votre projet *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={values.message}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/15 focus:border-white/40 py-3 text-sm text-white/80 outline-none transition-colors duration-300 font-body placeholder:text-white/15 resize-none"
                      placeholder="Décrivez votre projet : date, lieu, ambiance souhaitée, nombre de personnes..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {formState === 'sending' ? 'Envoi...' : 'Envoyer'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
