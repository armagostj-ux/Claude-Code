import { NavBar } from './components/NavBar'
import { Hero } from './components/Hero'
import { BenefitsGrid } from './components/BenefitsGrid'
import { CompoundingCalculator } from './components/CompoundingCalculator'
import { ScenarioPlanner } from './components/ScenarioPlanner'
import { Timeline } from './components/Timeline'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-surface-2 text-text-primary">
      <NavBar />
      <main>
        <Hero />
        <BenefitsGrid />
        <CompoundingCalculator />
        <ScenarioPlanner />
        <Timeline />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default App
