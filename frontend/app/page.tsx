import AuroraBackground from '@/components/AuroraBackground'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Logos from '@/components/Logos'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import ChatDemo from '@/components/ChatDemo'
import Stats from '@/components/Stats'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <AuroraBackground />
      <Navbar />
      <main>
        <Hero />
        <Logos />
        <Features />
        <HowItWorks />
        <ChatDemo />
        <Stats />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}