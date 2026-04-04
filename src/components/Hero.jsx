import { motion } from 'framer-motion'

const FILTER_LABELS = {
  tous: 'Tout mon séjour',
  soeur: 'Avec ma sœur',
  meparents: 'Avec mes parents',
  copain: 'Avec mon copain',
}

export default function Hero({ filter, isParentsView }) {
  const label = isParentsView
    ? 'Séjour des parents · 5–17 avril'
    : FILTER_LABELS[filter] || filter

  return (
    <div className="relative bg-gradient-to-br from-lagon-dark via-lagon to-[#2A9D8F] px-6 pt-10 pb-8 text-center text-white overflow-hidden sm:px-8 sm:pt-12 sm:pb-10">
      <div className="absolute inset-0 hero-dots pointer-events-none" />
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.7, y: 0 }}
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
        animate={{ opacity: 0.75 }}
        transition={{ delay: 0.2 }}
        className="text-[13px] font-light"
      >
        Clique sur un jour pour en voir le détail · Scrolle pour la vue complète
      </motion.p>
      <motion.span
        key={label}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-block mt-3 bg-white/15 rounded-full px-3.5 py-1 text-xs font-medium"
      >
        Vue : {label}
      </motion.span>
      <svg className="absolute bottom-[-1px] left-0 right-0 w-full" viewBox="0 0 1440 44" preserveAspectRatio="none">
        <path fill="#F7F1E3" d="M0,22 C360,44 1080,0 1440,22 L1440,44 L0,44 Z" />
      </svg>
    </div>
  )
}
