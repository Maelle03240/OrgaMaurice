import { useState } from 'react'
import { motion } from 'framer-motion'
import { PhoneCall, Calculator, BookOpen, ArrowRightLeft, ShieldAlert } from 'lucide-react'
import WeatherWidget from './WeatherWidget'

export default function UsefulInfo() {
  const [eur, setEur] = useState('1')
  const [mur, setMur] = useState('53')
  const RATE = 53

  const handleEurChange = (e) => {
    const val = e.target.value
    setEur(val)
    if (val === '') setMur('')
    else setMur((parseFloat(val) * RATE).toFixed(2).replace(/\.00$/, ''))
  }

  const handleMurChange = (e) => {
    const val = e.target.value
    setMur(val)
    if (val === '') setEur('')
    else setEur((parseFloat(val) / RATE).toFixed(2).replace(/\.00$/, ''))
  }

  return (
    <div className="max-w-[1140px] mx-auto px-3 py-4 sm:px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        
        {/* Converter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] p-4 sm:p-5 flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 text-lagon-dark font-display text-lg font-bold mb-4">
            <Calculator size={20} className="text-lagon" />
            Convertisseur (Taux : {RATE} Rs)
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <input
                type="number"
                value={eur}
                onChange={handleEurChange}
                className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-xl font-medium outline-none focus:border-lagon transition-colors"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">€</span>
            </div>
            
            <div className="text-stone-300 bg-sand-dark rounded-full p-2 shrink-0 rotate-90 sm:rotate-0">
              <ArrowRightLeft size={16} />
            </div>

            <div className="relative w-full">
              <input
                type="number"
                value={mur}
                onChange={handleMurChange}
                className="w-full bg-lagon-light/30 border border-lagon/20 rounded-lg px-4 py-3 text-xl font-medium outline-none focus:border-lagon transition-colors"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lagon-dark font-bold">Rs</span>
            </div>
          </div>
        </motion.div>

        {/* Weather */}
        <WeatherWidget />

        {/* Emergency Numbers */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] p-4 sm:p-5"
        >
          <div className="flex items-center gap-2 text-coral font-display text-lg font-bold mb-4">
            <ShieldAlert size={20} />
            Numéros d'Urgence
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-coral-light/20 border border-coral/20 rounded-lg p-3 flex flex-col justify-center items-center">
              <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Police</span>
              <span className="text-coral text-xl font-bold font-display mt-0.5">999</span>
            </div>
            <div className="bg-coral-light/20 border border-coral/20 rounded-lg p-3 flex flex-col justify-center items-center">
              <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">SAMU</span>
              <span className="text-coral text-xl font-bold font-display mt-0.5">114</span>
            </div>
            <div className="bg-coral-light/20 border border-coral/20 rounded-lg p-3 flex flex-col justify-center items-center">
              <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Pompiers</span>
              <span className="text-coral text-xl font-bold font-display mt-0.5">115</span>
            </div>
            <div className="bg-coral-light/20 border border-coral/20 rounded-lg p-3 flex flex-col justify-center items-center">
              <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider text-center">Garde-Côtes</span>
              <span className="text-coral text-xl font-bold font-display mt-0.5">213-4000</span>
            </div>
          </div>
        </motion.div>

        {/* Creole Dictionary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] p-4 sm:p-5 md:col-span-2"
        >
          <div className="flex items-center gap-2 text-jungle font-display text-lg font-bold mb-4">
            <BookOpen size={20} className="text-jungle" />
            Lexique Créole Mauricien
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { fr: 'Bonjour', cr: 'Bonzour' },
              { fr: 'Comment ça va ?', cr: 'Ki maniere ?' },
              { fr: 'Ça va bien / D\'accord', cr: 'Korek' },
              { fr: 'Merci beaucoup', cr: 'Mersi boukou' },
              { fr: 'S\'il vous plaît', cr: 'Si ou plé' },
              { fr: 'Au revoir', cr: 'Apli / Salam' },
              { fr: 'Combien ça coûte ?', cr: 'Komien sa koute ?' },
              { fr: 'C\'est trop cher !', cr: 'Sa tro ser !' },
              { fr: 'Je ne comprends pas', cr: 'Mo pa kompran' },
              { fr: 'Où est la plage ?', cr: 'Kotsa laplaz ?' },
              { fr: 'Je voudrais aller à...', cr: 'Mo envi al...' },
              { fr: 'Très bon / Délicieux', cr: 'Mari bon' },
            ].map((word, i) => (
              <div key={i} className="flex justify-between items-center bg-sand p-2.5 rounded-lg border border-black/5">
                <span className="text-[13px] text-stone-500">{word.fr}</span>
                <span className="text-[14px] font-bold text-jungle-dark">{word.cr}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
