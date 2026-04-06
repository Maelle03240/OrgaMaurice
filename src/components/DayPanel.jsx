import { motion } from 'framer-motion'
import { X, Car, Bus, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { parseKey, dtype, formatFR, DT_ACCENT, DT_BADGES, ICON_MAP, MONTHS_FR, DAYS_LONG, dow } from '../lib/dates'

export default function DayPanel({
  dateKey, dayPlans, activities, dayTypes,
  onToggleCar, onToggleVacation, onAddActivity, onRemoveActivity, onRemoveDayType, onUpdateNotes, onClose
}) {
  if (!dateKey) return null

  const date = parseKey(dateKey)
  const dt = dtype(date)
  const plan = dayPlans[dateKey] || { activity_entries: [], notes: '', has_car: false, day_type_id: null }
  const badge = DT_BADGES[dt]
  const accent = DT_ACCENT[dt] || '#1B8FAD'
  const dayType = plan.day_type_id ? dayTypes.find(j => j.id === plan.day_type_id) : null

  const [localNotes, setLocalNotes] = useState(plan.notes || '')
  const [isFocused, setIsFocused] = useState(false)

  // Met à jour la valeur locale SI on ne tape pas dedans (ex: màj en direct par une autre personne)
  useEffect(() => {
    if (!isFocused) {
      setLocalNotes(plan.notes || '')
    }
  }, [plan.notes, isFocused, dateKey])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] overflow-hidden mt-3"
    >
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center gap-3 flex-wrap" style={{ borderLeft: `4px solid ${accent}` }}>
        <div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-stone-400 font-medium">
            {DAYS_LONG[dow(date)]}
          </div>
          <div className="font-display text-lg font-bold leading-tight">
            {date.getDate()} {MONTHS_FR[date.getMonth()]}
          </div>
        </div>
        {/* Only show "À planifier" badge if the day is truly empty */}
        {badge && (dt !== 'pl' || (plan.activity_entries?.length === 0 && !plan.day_type_id)) && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${badge.cls}`}>
            {badge.label}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => onToggleCar(dateKey)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-[1.5px] flex items-center gap-1 transition-all ${
              plan.has_car
                ? 'bg-jungle-light border-jungle text-jungle-dark'
                : 'border-black/10 bg-white/80 text-stone-500 hover:bg-jungle-light'
            }`}
          >
            {plan.has_car ? <><Car size={12} /> Voiture</> : <><Bus size={12} /> Bus/Taxi</>}
          </button>
          <button
            onClick={() => onToggleVacation(dateKey)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-all ${
              plan.is_vacation
                ? 'bg-sunset-light border-sunset text-[#6B4A10]'
                : 'border-black/10 bg-white/80 text-stone-500 hover:bg-sunset-light'
            }`}
          >
            {plan.is_vacation ? '🌴 Vacances' : '💼 Travail'}
          </button>
          <button
            onClick={() => onAddActivity(dateKey)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-lagon-light border-[1.5px] border-lagon text-lagon-dark hover:bg-lagon hover:text-white transition-all"
          >
            <Plus size={12} className="inline mr-0.5" /> Activité
          </button>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors ml-0.5">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {/* Day type badge */}
        {dayType && (
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-sunset-light text-[#6B4A10] border border-sunset mb-3">
            {dayType.icon} {dayType.name}
            <button onClick={() => onRemoveDayType(dateKey)} className="opacity-50 hover:opacity-100 text-[10px] ml-1">✕</button>
          </div>
        )}

        {/* Activities list */}
        <div className="flex flex-col gap-2">
          {plan.activity_entries?.length > 0 ? (
            plan.activity_entries.map((entry, idx) => {
              const act = activities.find(a => a.id === entry.actId)
              if (!act) return null
              return (
                <motion.div
                  key={entry.iid || idx}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-start gap-3 bg-sand rounded-sm p-3 border border-black/10 hover:shadow-sm transition-shadow"
                >
                  <span className="text-lg shrink-0 mt-0.5">{ICON_MAP[act.type] || '📌'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium">{act.name}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      📍 {act.lieu}
                      <span className={`ml-2 text-[11px] font-semibold px-1.5 py-px rounded-full ${
                        act.prix > 0 ? 'bg-jungle-light text-jungle-dark' : 'bg-jungle-light text-jungle-dark'
                      }`}>
                        {act.prix > 0 ? `~${act.prix}€` : 'Gratuit'}
                      </span>
                    </div>
                    {act.notes && <div className="text-[11px] text-stone-400 mt-1 whitespace-pre-line">{act.notes}</div>}
                  </div>
                  <button
                    onClick={() => onRemoveActivity(dateKey, idx)}
                    className="text-stone-400 opacity-40 hover:opacity-100 hover:text-coral transition-all shrink-0"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )
            })
          ) : (
            <div className="text-[12.5px] text-stone-400 italic py-1">
              Aucune activité · Clique sur "+ Activité"
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mt-3 pt-3 border-t border-dashed border-black/10">
          <textarea
            className="w-full bg-transparent text-[12px] text-stone-400 outline-none resize-none font-body leading-relaxed min-h-[26px] placeholder:text-[#C4B49E]"
            placeholder="Notes pour cette journée…"
            value={localNotes}
            rows={1}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              if (localNotes !== plan.notes) {
                onUpdateNotes(dateKey, localNotes)
              }
            }}
            onChange={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = e.target.scrollHeight + 'px'
              setLocalNotes(e.target.value)
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
