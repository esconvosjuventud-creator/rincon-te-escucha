import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { FloatingIdeaButton } from '../components/FloatingIdeaButton'
import { Hero } from '../sections/Hero'
import { AboutSection } from '../sections/AboutSection'
import { VoiceValues } from '../sections/VoiceValues'
import { ProposalForm } from '../sections/ProposalForm'
import { IdeasImpact } from '../sections/IdeasImpact'
import { ResourcesSection } from '../sections/ResourcesSection'
import { TipOfDay } from '../sections/TipOfDay'
import { CampaignGallery } from '../sections/CampaignGallery'
import { FaqSection } from '../sections/FaqSection'
import { ContactSection } from '../sections/ContactSection'
import { fallbackFaq, fallbackResources, fallbackTips } from '../data/fallback'
import { getPublicFaq, getPublicResources, getPublicSettings, getPublicTips } from '../services/publicContent'
import type { FaqItem, Resource, Tip } from '../types'

export default function HomePage() {
  const [resources, setResources] = useState<Resource[]>(fallbackResources)
  const [tips, setTips] = useState<Tip[]>(fallbackTips)
  const [faq, setFaq] = useState<FaqItem[]>(fallbackFaq)
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    let alive = true
    Promise.all([getPublicResources(), getPublicTips(), getPublicFaq(), getPublicSettings()]).then(([r, t, f, s]) => {
      if (!alive) return
      setResources(r); setTips(t); setFaq(f); setSettings(s)
    }).catch(() => undefined)
    return () => { alive = false }
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <VoiceValues />
        <ProposalForm />
        <IdeasImpact />
        <ResourcesSection resources={resources} />
        <TipOfDay tips={tips} />
        <CampaignGallery />
        <FaqSection items={faq} />
        <ContactSection settings={settings} />
      </main>
      <Footer />
      <FloatingIdeaButton />
    </>
  )
}
