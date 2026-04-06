import { motion } from 'framer-motion'

const FILTER_LABELS = {
  tous: 'Tout mon séjour',
  soeur: 'Avec ma sœur',
  meparents: 'Avec mes parents',
  copain: 'Avec mon copain',
}

// 🌊 CAUSTICS (Eau scintillante très douce)
const WaterReflections = () => (
  <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-[0.04] pointer-events-none select-none">
    <motion.div
      className="absolute -inset-[100%]"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}images/caustics.png)`,
        backgroundSize: '400px 400px',
        backgroundRepeat: 'repeat'
      }}
      animate={{ x: ['0px', '-200px'], y: ['0px', '200px'] }}
      transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
    />
  </div>
)

// 🐢 TORTUE
const Turtle = () => (
  <motion.div
    className="absolute top-[25%] pointer-events-none mix-blend-screen opacity-[0.12] select-none z-0"
    initial={{ left: '-20%', rotate: 100 }}
    animate={{ left: '120%', y: [0, -15, 0, 15, 0], rotate: [100, 95, 105, 98, 100] }}
    transition={{
      left: { repeat: Infinity, duration: 55, ease: 'linear' },
      y: { repeat: Infinity, duration: 15, ease: 'easeInOut' },
      rotate: { repeat: Infinity, duration: 15, ease: 'easeInOut' }
    }}
  >
    <img src={`${import.meta.env.BASE_URL}images/turtle.png`} alt="" className="w-24 h-24 sm:w-32 sm:h-32 object-contain" />
  </motion.div>
)

// 🌊 RAIE MANTA (Profil)
const MantaRay = () => (
  <motion.div
    className="absolute bottom-[10%] pointer-events-none mix-blend-screen opacity-[0.09] select-none z-0"
    initial={{ right: '-30%', rotate: -5, scale: 0.9 }}
    animate={{ right: '130%', y: [0, -30, 0], rotate: [-5, -15, -2] }}
    transition={{
      right: { repeat: Infinity, duration: 65, ease: 'linear', delay: 10 },
      y: { repeat: Infinity, duration: 25, ease: 'easeInOut' },
      rotate: { repeat: Infinity, duration: 25, ease: 'easeInOut' }
    }}
  >
    <img src={`${import.meta.env.BASE_URL}images/ray.png`} alt="" className="w-[130px] h-[130px] sm:w-[170px] sm:h-[170px] object-contain" />
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
