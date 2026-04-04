import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ICON_MAP } from '../lib/dates'

export default function Library({ activities, dayTypes, onUseJtype, onAddActToDate }) {
  const [tab, setTab] = useState('jtypes')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Tabs */}
      <div className="flex gap-1.5 mb-4">
        <button
          onClick={() => setTab('jtypes')}
          className={`text-xs font-medium px-3.5 py-1 rounded-full border-[1.5px] transition-all ${
            tab === 'jtypes' ? 'bg-lagon text-white border-transparent' : 'border-black/10 bg-white/50 text-stone-500'
          }`}
        >
          Journées types
        </button>
        <button
          onClick={() => setTab('acts')}
          className={`text-xs font-medium px-3.5 py-1 rounded-full border-[1.5px] transition-all ${
            tab === 'acts' ? 'bg-lagon text-white border-transparent' : 'border-black/10 bg-white/50 text-stone-500'
          }`}
        >
          Activités
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'jtypes' ? (
          <motion.div
            key="jtypes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-3"
          >
            {dayTypes.map(jt => {
              const total = (jt.activity_ids || []).reduce((s, id) => {
                const a = activities.find(x => x.id === id)
                return s + (a ? Number(a.prix) : 0)
              }, 0)
              return (
                <div key={jt.id} className="bg-cream rounded-card border border-black/10 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all">
                  <div className="h-[5px]" style={{ background: jt.color }} />
                  <div className="p-4">
                    <div className="text-2xl mb-2">{jt.icon}</div>
                    <div className="font-display text-[.92rem] font-bold mb-1">{jt.name}</div>
                    <div className="text-xs text-stone-400 leading-relaxed mb-2">{jt.description}</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(jt.activity_ids || []).map(aid => {
                        const a = activities.find(x => x.id === aid)
                        return a ? (
                          <span key={aid} className="text-[10px] px-1.5 py-0.5 rounded-full bg-sand-dark text-stone-400 font-medium">
                            {a.name}
                          </span>
                        ) : null
                      })}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-semibold text-jungle-dark">
                        {total > 0 ? `~${total}€ / pers` : 'Gratuit'}
                      </span>
                      <button
                        onClick={() => onUseJtype(jt.id)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-lagon-light border-[1.5px] border-lagon text-lagon-dark hover:bg-lagon hover:text-white transition-all"
                      >
                        Utiliser →
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            {dayTypes.length === 0 && (
              <div className="text-sm text-stone-400 italic col-span-full py-4 text-center">
                Aucune journée type. Crée-en une dans l'Admin !
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="acts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-2"
          >
            {activities.map(act => (
              <div key={act.id} className="bg-cream rounded-sm border border-black/10 p-3 flex items-start gap-2.5 hover:shadow-md transition-shadow">
                <span className="text-lg shrink-0">{ICON_MAP[act.type] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium">{act.name}</div>
                  <div className="text-[11px] text-stone-400">📍 {act.lieu} · {act.prix > 0 ? `~${act.prix}€` : 'Gratuit'}</div>
                </div>
                <button
                  onClick={() => onAddActToDate(act.id)}
                  className="border-[1.5px] border-lagon text-lagon rounded-full w-[22px] h-[22px] flex items-center justify-center text-lg hover:bg-lagon hover:text-white transition-all shrink-0 mt-0.5"
                >
                  +
                </button>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="text-sm text-stone-400 italic col-span-full py-4 text-center">
                Aucune activité. Crée-en une dans l'Admin !
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
