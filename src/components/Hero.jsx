import { motion } from 'framer-motion'

const FILTER_LABELS = {
  tous: 'Tout mon séjour',
  soeur: 'Avec ma sœur',
  meparents: 'Avec mes parents',
  copain: 'Avec mon copain',
}

const WaterReflections = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-overlay opacity-30 select-none">
    <motion.div 
      className="absolute -inset-[100%]"
      style={{
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0) 30%)',
        backgroundSize: '150px 150px'
      }}
      animate={{ backgroundPosition: ['0px 0px', '150px 150px'] }}
      transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
    />
    <motion.div 
      className="absolute -inset-[100%]"
      style={{
        backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0) 40%)',
        backgroundSize: '200px 200px'
      }}
      animate={{ backgroundPosition: ['0px 0px', '-200px 200px'] }}
      transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
    />
  </div>
)

const Turtle = () => (
  <motion.div
    className="absolute top-[25%] pointer-events-none text-white/15 select-none"
    initial={{ left: '-10%', rotate: 10 }}
    animate={{ left: '110%', y: [0, -15, 0, 10, 0], rotate: [10, 5, 12, 8, 10] }}
    transition={{ 
      left: { repeat: Infinity, duration: 35, ease: 'linear' },
      y: { repeat: Infinity, duration: 8, ease: 'easeInOut' },
      rotate: { repeat: Infinity, duration: 8, ease: 'easeInOut' }
    }}
  >
    <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
      {/* Côté gauche (nageoires) */}
      <path d="M40 35 Q20 20 5 35 Q20 45 38 40 Z" />
      <path d="M42 65 Q30 75 25 85 Q40 85 45 68 Z" />
      {/* Côté droit (nageoires) */}
      <path d="M60 35 Q80 20 95 35 Q80 45 62 40 Z" />
      <path d="M58 65 Q70 75 75 85 Q60 85 55 68 Z" />
      {/* Tête */}
      <circle cx="50" cy="20" r="6" />
      {/* Carapace */}
      <ellipse cx="50" cy="50" rx="16" ry="22" />
    </svg>
  </motion.div>
)

const MantaRay = () => (
  <motion.div
    className="absolute bottom-[10%] pointer-events-none text-black/[0.04] select-none"
    initial={{ right: '-20%', rotate: -15, scale: 1.5 }}
    animate={{ right: '120%', y: [0, -30, 0], rotate: [-15, -25, -15] }}
    transition={{ 
      right: { repeat: Infinity, duration: 45, ease: 'linear', delay: 10 },
      y: { repeat: Infinity, duration: 15, ease: 'easeInOut' },
      rotate: { repeat: Infinity, duration: 15, ease: 'easeInOut' }
    }}
  >
    <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
      {/* Corps et ailes */}
      <path d="M 50 15 Q 85 25 98 45 Q 75 60 50 70 Q 25 60 2 45 Q 15 25 50 15 Z" />
      {/* Queue */}
      <path d="M 50 70 Q 50 85 52 100" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Cornes */}
      <path d="M 46 16 Q 40 5 44 2 Q 50 10 48 15" />
      <path d="M 54 16 Q 60 5 56 2 Q 50 10 52 15" />
    </svg>
  </motion.div>
)

export default function Hero({ filter, isParentsView }) {
  const label = isParentsView
    ? 'Séjour des parents · 5–17 avril'
    : FILTER_LABELS[filter] || filter

  return (
    <div className="relative bg-gradient-to-br from-lagon-dark via-lagon to-[#2A9D8F] px-6 pt-10 pb-8 text-center text-white overflow-hidden sm:px-8 sm:pt-12 sm:pb-10">
      {/* --- Effets sous-marins --- */}
      <div className="absolute inset-0 hero-dots pointer-events-none opacity-50" />
      <WaterReflections />
      <MantaRay />
      <Turtle />
      {/* ------------------------- */}
      
      <div className="relative z-10 drop-shadow-sm">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.8, y: 0 }}
          className="text-[11px] uppercase tracking-[0.22em] mb-3"
        >
          18 mars → 21 juin 2026 · Péreybère
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-[clamp(1.6rem,5vw,3.2rem)] font-bold leading-[1.05] mb-2"
        >
          Mon séjour à l'<em className="italic text-[#8EE3EF]">Île Maurice</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.2 }}
          className="text-[13px] font-light"
        >
          Clique sur un jour pour en voir le détail · Scrolle pour la vue complète
        </motion.p>
        <motion.span
          key={label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block mt-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-medium border border-white/10"
        >
          Vue : {label}
        </motion.span>
      </div>

      <svg className="absolute bottom-[-1px] left-0 right-0 w-full z-20 pointer-events-none" viewBox="0 0 1440 44" preserveAspectRatio="none">
        <path fill="#F7F1E3" d="M0,22 C360,44 1080,0 1440,22 L1440,44 L0,44 Z" />
      </svg>
    </div>
  )
}
