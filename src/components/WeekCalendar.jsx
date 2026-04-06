import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getFortnight, dk, dtype, inTrip,
  DT_COLORS, DAYS_SHORT, MONTHS_FR, TRIP_START, TRIP_END, dotColor
} from '../lib/dates'

export default function WeekCalendar({ weekStart, onWeekChange, selectedDay, onSelectDay, dayPlans, activities }) {
  const days = useMemo(() => getFortnight(weekStart), [weekStart])

  const monthLabel = useMemo(() => {
    const months = new Set(days.filter(d => inTrip(d)).map(d => d.getMonth()))
    const parts = [...months].map(m => MONTHS_FR[m])
    return parts.join(' – ') + ' ' + days[0].getFullYear()
  }, [days])

  const prevPeriod = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 14)
    if (d >= new Date(TRIP_START.getTime() - 14 * 86400000)) onWeekChange(d)
  }
  const nextPeriod = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 14)
    if (d <= new Date(TRIP_END.getTime() + 14 * 86400000)) onWeekChange(d)
  }

  return (
    <div className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-lagon-dark text-white sm:px-4 sm:py-2.5">
        <button onClick={prevPeriod} className="hover:bg-white/20 rounded-md p-1 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="font-display text-sm font-semibold">{monthLabel}</span>
        <button onClick={nextPeriod} className="hover:bg-white/20 rounded-md p-1 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 14-day grid */}
      <div className="p-2 sm:p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={dk(days[0])}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-7 gap-1"
          >
            {/* Row 1: day names for first week */}
            {days.slice(0, 7).map((d, i) => (
              <div key={`lbl1-${i}`} className="text-[9px] text-center text-stone-400 uppercase tracking-wider font-medium pb-0.5">
                {DAYS_SHORT[(d.getDay() + 6) % 7]}
              </div>
            ))}
            {/* Row 2: first 7 days */}
            {days.slice(0, 7).map(day => renderDay(day, selectedDay, onSelectDay, dayPlans, activities))}
            {/* Separator */}
            <div className="col-span-7 h-px bg-black/5 my-0.5" />
            {/* Row 3: day names for second week */}
            {days.slice(7, 14).map((d, i) => (
              <div key={`lbl2-${i}`} className="text-[9px] text-center text-stone-400 uppercase tracking-wider font-medium pb-0.5">
                {DAYS_SHORT[(d.getDay() + 6) % 7]}
              </div>
            ))}
            {/* Row 4: next 7 days */}
            {days.slice(7, 14).map(day => renderDay(day, selectedDay, onSelectDay, dayPlans, activities))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="px-3 pb-2.5 flex flex-wrap gap-2">
        {[
          { color: '#C8EDD0', label: 'Sœur' },
          { color: '#FAD9CC', label: 'Parents' },
          { color: '#D6F0F7', label: 'Solo' },
          { color: '#EDE9F5', label: 'Maël' },
          { color: '#E8F4EB', label: 'À planifier', border: '1.5px dashed #74C281' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1 text-[10px] text-stone-400">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color, border: l.border || 'none' }} />
            {l.label}
          </div>
        ))}
        <div className="flex items-center gap-1 text-[10px] text-stone-400">
          <span>🌴</span> Maëlle
        </div>
      </div>
    </div>
  )
}

function renderDay(day, selectedDay, onSelectDay, dayPlans, activities) {
  const key = dk(day)
  const dt = dtype(day)
  const isIn = inTrip(day)
  const selected = key === selectedDay
  const colors = DT_COLORS[dt] || DT_COLORS.def
  const plan = dayPlans[key]
  const actEntries = plan?.activity_entries || []
  const hasActivities = actEntries.length > 0 || plan?.day_type_id

  // Dashed border for trip days with no planned activities;
  // also suppress the pl-type dashed border when activities exist
  const emptyBorder = hasActivities
    ? '1px solid transparent'
    : isIn && dt !== 'avant' && dt !== 'apres' && dt !== 'transit'
      ? (colors.border || '1.5px dashed rgba(0,0,0,0.18)')
      : '1px solid transparent'

  return (
    <button
      key={key}
      onClick={() => isIn && onSelectDay(key)}
      disabled={!isIn}
      className={`
        relative rounded-lg py-2 px-0.5 flex flex-col items-center justify-center gap-0.5
        transition-all duration-150
        ${isIn ? 'cursor-pointer hover:scale-105 hover:brightness-90' : 'opacity-30 cursor-default'}
        ${selected ? 'ring-2 ring-stone-800 ring-offset-1' : ''}
      `}
      style={{
        background: colors.bg,
        color: colors.text,
        border: emptyBorder
      }}
    >
      {/* Palm tree 🌴 inline below number for Vacation days */}
      <span className="text-[11px] font-semibold leading-none">{day.getDate()}</span>
      {plan?.is_vacation && <span className="text-[8px] leading-none">🌴</span>}
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
