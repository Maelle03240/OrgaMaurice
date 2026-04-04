import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  getAllParentDays, parseKey, dtypeParents, isConge,
  DT_COLORS, DAYS_SHORT, dow, dotColor
} from '../lib/dates'

export default function ParentsCalendar({ parentPlans, activities, selectedDay, onSelectDay }) {
  const days = useMemo(() => getAllParentDays(), [])

  // Split into weeks aligned by day of week
  // Row 1: 5-11 avril (dim→sam = 7 days)
  // Row 2: 12-17 avril (dim→ven = 6 days + 1 empty)
  const row1 = days.slice(0, 7)  // 7 days
  const row2 = days.slice(7)     // 6 days
  const row2Pad = 7 - row2.length // 1 empty cell at end

  return (
    <div className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-2.5 bg-sunset text-stone-900">
        <span className="font-display text-sm font-semibold">☀️ Séjour des parents · 5–17 Avril</span>
      </div>

      {/* Grid */}
      <div className="p-2 sm:p-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Row 1 */}
          <div className="grid grid-cols-7 gap-1 mb-0.5">
            {row1.map((k, i) => {
              const d = parseKey(k)
              return (
                <div key={`h1-${i}`} className="text-[9px] text-center text-stone-400 uppercase tracking-wider font-medium">
                  {DAYS_SHORT[dow(d)]}
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {row1.map(k => renderParentDay(k, parentPlans, activities, selectedDay, onSelectDay))}
          </div>

          {/* Separator */}
          <div className="h-px bg-black/5 my-1.5" />

          {/* Row 2 */}
          <div className="grid grid-cols-7 gap-1 mb-0.5">
            {row2.map((k, i) => {
              const d = parseKey(k)
              return (
                <div key={`h2-${i}`} className="text-[9px] text-center text-stone-400 uppercase tracking-wider font-medium">
                  {DAYS_SHORT[dow(d)]}
                </div>
              )
            })}
            {Array.from({ length: row2Pad }).map((_, i) => (
              <div key={`hp-${i}`} />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {row2.map(k => renderParentDay(k, parentPlans, activities, selectedDay, onSelectDay))}
            {Array.from({ length: row2Pad }).map((_, i) => (
              <div key={`ep-${i}`} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Legend — same as WeekCalendar */}
      <div className="px-3 pb-2.5 flex flex-wrap gap-2">
        {[
          { color: '#C9F0E0', label: '🌴 Congé Maëlle' },
          { color: '#EDE9F5', label: 'Sous-marin' },
          { color: '#E8F4EB', label: 'À planifier', border: '1.5px dashed #74C281' },
          { color: '#E2DDD4', label: 'Transit' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1 text-[10px] text-stone-400">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color, border: l.border || 'none' }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}

function renderParentDay(dateKey, parentPlans, activities, selectedDay, onSelectDay) {
  const date = parseKey(dateKey)
  const dt = dtypeParents(date)
  const colors = DT_COLORS[dt] || DT_COLORS.def
  const selected = dateKey === selectedDay
  const plan = parentPlans[dateKey]
  const actEntries = plan?.activity_entries || []
  const hasActivities = actEntries.length > 0 || plan?.day_type_id
  const conge = isConge(date)

  // Same border logic as WeekCalendar: dashed only when no activities
  const border = hasActivities
    ? '1px solid transparent'
    : (colors.border || '1.5px dashed rgba(0,0,0,0.18)')

  return (
    <button
      key={dateKey}
      onClick={() => onSelectDay(dateKey)}
      className={`
        relative rounded-lg py-2 px-0.5 flex flex-col items-center justify-center gap-0.5
        transition-all duration-150 cursor-pointer hover:scale-105 hover:brightness-90
        ${selected ? 'ring-2 ring-stone-800 ring-offset-1' : ''}
      `}
      style={{
        background: colors.bg,
        color: colors.text,
        border
      }}
    >
      <span className="text-[11px] font-semibold leading-none">{date.getDate()}</span>
      {conge && <span className="text-[7px] leading-none">🌴</span>}
      {actEntries.length > 0 && (
        <div className="flex gap-[2px] mt-0.5">
          {actEntries.slice(0, 3).map((entry, i) => {
            const act = activities.find(a => a.id === entry.actId)
            return (
              <div
                key={i}
                className="w-[3.5px] h-[3.5px] rounded-full"
                style={{ background: act ? dotColor(act.type) : '#CCC' }}
              />
            )
          })}
        </div>
      )}
      {plan?.has_car && <span className="text-[7px] leading-none">🚗</span>}
    </button>
  )
}

