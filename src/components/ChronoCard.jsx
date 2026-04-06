import { motion } from 'framer-motion'
import { Car, Bus, Plus, X } from 'lucide-react'
import { parseKey, dtype, DT_ACCENT, DT_BADGES, ICON_MAP, MONTHS_FR, DAYS_LONG, dow } from '../lib/dates'

export default function ChronoCard({
  dateKey, plan, activities, dayTypes,
  onToggleCar, onToggleVacation, onAddActivity, onRemoveActivity, onRemoveDayType, highlight
}) {
  const date = parseKey(dateKey)
  const dt = dtype(date)
  const accent = DT_ACCENT[dt] || '#1B8FAD'
  const badge = DT_BADGES[dt]
  const dayType = plan?.day_type_id ? dayTypes.find(j => j.id === plan.day_type_id) : null
  const entries = plan?.activity_entries || []

  return (
    <motion.div
      id={`chr-${dateKey}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] overflow-hidden scroll-mt-16 transition-shadow hover:shadow-lg ${
        highlight ? 'ring-2 ring-lagon shadow-lg' : ''
      }`}
    >
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center gap-3 flex-wrap" style={{ borderLeft: `4px solid ${accent}` }}>
        <div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-stone-400 font-medium">
            {DAYS_LONG[dow(date)]}
          </div>
          <div className="font-display text-[1.1rem] font-bold leading-tight">
            {date.getDate()} {MONTHS_FR[date.getMonth()]}
          </div>
        </div>
        {/* Only show the "À planifier" badge if the day is truly empty */}
        {badge && (dt !== 'pl' || (entries.length === 0 && !dayType)) && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${badge.cls}`}>
            {badge.label}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => onToggleCar(dateKey)}
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border-[1.5px] flex items-center gap-1 transition-all ${
              plan?.has_car ? 'bg-jungle-light border-jungle text-jungle-dark' : 'border-black/10 bg-white/80 text-stone-500'
            }`}
            title={plan?.has_car ? 'Voiture' : 'Bus/Taxi'}
          >
            {plan?.has_car ? <Car size={11} /> : <Bus size={11} />}
          </button>
          <button
            onClick={() => onToggleVacation(dateKey)}
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border-[1.5px] flex items-center gap-1 transition-all ${
              plan?.is_vacation ? 'bg-sunset-light border-sunset text-[#6B4A10]' : 'border-black/10 bg-white/80 text-stone-500'
            }`}
            title={plan?.is_vacation ? 'Vacances' : 'Travail'}
          >
            {plan?.is_vacation ? '🌴' : '💼'}
          </button>
          <button
            onClick={() => onAddActivity(dateKey)}
            className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-lagon-light border-[1.5px] border-lagon text-lagon-dark hover:bg-lagon hover:text-white transition-all"
          >
            + Activité
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-2.5">
        {dayType && (
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-sunset-light text-[#6B4A10] border border-sunset mb-2">
            {dayType.icon} {dayType.name}
            <button onClick={() => onRemoveDayType(dateKey)} className="opacity-50 hover:opacity-100 text-[10px] ml-1">✕</button>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          {entries.length > 0 ? entries.map((entry, idx) => {
            const act = activities.find(a => a.id === entry.actId)
            if (!act) return null
            return (
              <div
                key={entry.iid || idx}
                className={`flex items-center gap-2.5 rounded-sm p-2.5 border border-black/10 transition-all ${
                  entry.is_option ? 'bg-sand/40 opacity-60 border-dashed' : 'bg-sand'
                }`}
              >
                <span className="text-base shrink-0">{ICON_MAP[act.type] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="text-[12.5px] font-medium">{act.name}</div>
                    {entry.is_option && (
                      <span className="text-[9px] font-bold px-1.5 py-px rounded-full border border-stone-300 text-stone-400 uppercase tracking-wider">
                        option
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    📍 {act.lieu}
                    <span className={`ml-1.5 font-semibold px-1.5 py-px rounded-full ${
                      act.prix > 0 ? 'bg-jungle-light text-jungle-dark' : 'bg-jungle-light text-jungle-dark'
                    }`}>
                      {act.prix > 0 ? `~${act.prix}€` : 'Gratuit'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveActivity(dateKey, idx)}
                  className="text-stone-400 opacity-40 hover:opacity-100 hover:text-coral transition-all shrink-0"
                >
                  <X size={13} />
                </button>
              </div>
            )
          }) : (
            <div className="text-[12.5px] text-stone-400 italic">Aucune activité planifiée</div>
          )}
        </div>
        {plan?.notes?.trim() && (
          <div className="mt-2 pt-2 border-t border-dashed border-black/10">
            <div className="text-[12px] text-stone-400 leading-relaxed whitespace-pre-line">{plan.notes}</div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
