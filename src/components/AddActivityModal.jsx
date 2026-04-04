import { useState, useMemo } from 'react'
import { formatFR, TYPE_LABELS, SLOTS } from '../lib/dates'

export default function AddActivityModal({
  mode, // 'activities' | 'jtype' | 'singleAct'
  dateKey,
  activities,
  dayType,
  singleActivity,
  showCalendarChoice, // true if in overlap period (parents dates)
  onConfirm,
  onClose,
}) {
  const [picks, setPicks] = useState(() => {
    const m = {}
    activities.forEach(a => { m[a.id] = 0 })
    return m
  })
  const [pickedDate, setPickedDate] = useState('')
  const [targetCalendar, setTargetCalendar] = useState('moi')
  const [slot, setSlot] = useState('matin') // default slot

  const byType = useMemo(() => {
    const m = {}
    activities.forEach(a => {
      if (!m[a.type]) m[a.type] = []
      m[a.type].push(a)
    })
    return m
  }, [activities])

  const handleConfirm = () => {
    if (mode === 'activities') {
      const items = []
      Object.entries(picks).forEach(([actId, count]) => {
        for (let i = 0; i < count; i++) items.push(actId)
      })
      if (items.length === 0) { onClose(); return }
      onConfirm({ dateKey, activityIds: items, calendar: targetCalendar, slot })
    } else if (mode === 'jtype') {
      if (!pickedDate) { alert('Choisis une date !'); return }
      onConfirm({ dateKey: pickedDate, dayTypeId: dayType.id, activityIds: dayType.activity_ids || [], calendar: targetCalendar, slot })
    } else if (mode === 'singleAct') {
      if (!pickedDate) { alert('Choisis une date !'); return }
      onConfirm({ dateKey: pickedDate, activityIds: [singleActivity.id], calendar: targetCalendar, slot })
    }
  }

  const inc = (id) => setPicks(p => ({ ...p, [id]: (p[id] || 0) + 1 }))
  const dec = (id) => setPicks(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) - 1) }))

  let title = 'Ajouter des activités'
  let subtitle = ''
  if (mode === 'activities' && dateKey) {
    subtitle = '→ ' + formatFR(new Date(dateKey + 'T00:00:00'))
  } else if (mode === 'jtype' && dayType) {
    title = `${dayType.icon} ${dayType.name}`
    subtitle = 'Choisir la date'
  } else if (mode === 'singleAct' && singleActivity) {
    title = `Ajouter : ${singleActivity.name}`
    subtitle = 'Choisir la date'
  }

  return (
    <div className="fixed inset-0 bg-black/45 z-[500] flex items-center justify-center p-3 sm:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-cream rounded-card p-4 sm:p-6 max-w-[480px] w-full shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto">
        <h3 className="font-display text-base sm:text-lg font-bold mb-0.5">{title}</h3>
        <p className="text-xs text-stone-400 mb-4">{subtitle}</p>

        {/* Slot picker */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium mb-1.5">Moment de la journée</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(SLOTS).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setSlot(key)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-all ${
                  slot === key
                    ? 'border-transparent text-white'
                    : 'border-black/10 bg-white/60 text-stone-400'
                }`}
                style={slot === key ? { background: s.text, color: '#fff' } : {}}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'activities' && (
          <div>
            {Object.entries(byType).map(([type, acts]) => (
              <div key={type} className="mb-3">
                <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium mb-1.5">
                  {TYPE_LABELS[type] || type}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {acts.map(act => (
                    <div
                      key={act.id}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full border-[1.5px] text-[11px] transition-all ${
                        (picks[act.id] || 0) > 0 ? 'border-lagon bg-lagon-light' : 'border-black/10 bg-sand'
                      }`}
                    >
                      <span className={`font-medium ${(picks[act.id] || 0) > 0 ? 'text-lagon-dark' : 'text-stone-400'}`}>
                        {act.name}{act.prix > 0 ? ` (~${act.prix}€)` : ''}
                      </span>
                      <button onClick={() => dec(act.id)} className="w-4 h-4 rounded-full bg-sand-dark flex items-center justify-center text-[12px] text-stone-400">−</button>
                      <span className="text-[11px] font-semibold text-lagon-dark min-w-[12px] text-center">{picks[act.id] || 0}</span>
                      <button onClick={() => inc(act.id)} className="w-4 h-4 rounded-full bg-lagon text-white flex items-center justify-center text-[12px]">+</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {mode === 'jtype' && dayType && (
          <div>
            <p className="text-xs text-stone-400 mb-2">{dayType.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {(dayType.activity_ids || []).map(aid => {
                const a = activities.find(x => x.id === aid)
                return a ? <span key={aid} className="text-[10px] px-1.5 py-0.5 rounded-full bg-sand-dark text-stone-400">{a.name}</span> : null
              })}
            </div>
            <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Date</label>
            <input type="date" className="px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon w-full max-w-[190px]" value={pickedDate} onChange={e => setPickedDate(e.target.value)} min="2026-03-18" max="2026-06-21" />
          </div>
        )}

        {mode === 'singleAct' && (
          <div>
            <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Date</label>
            <input type="date" className="px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon w-full max-w-[190px]" value={pickedDate} onChange={e => setPickedDate(e.target.value)} min="2026-03-18" max="2026-06-21" />
          </div>
        )}

        {/* Calendar choice (shown during overlap dates) */}
        {showCalendarChoice && (
          <div className="mt-4 pt-3 border-t border-dashed border-black/10">
            <div className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">Ajouter dans quel calendrier ?</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'moi', label: '🌴 Mon calendrier', color: 'lagon' },
                { id: 'parents', label: '☀️ Calendrier parents', color: 'sunset' },
                { id: 'both', label: '📅 Les deux', color: 'jungle' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setTargetCalendar(opt.id)}
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-full border-[1.5px] transition-all ${
                    targetCalendar === opt.id
                      ? opt.id === 'moi' ? 'bg-lagon text-white border-transparent'
                        : opt.id === 'parents' ? 'bg-sunset text-stone-900 border-transparent'
                        : 'bg-jungle text-white border-transparent'
                      : 'border-black/10 bg-sand text-stone-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-sm bg-sand-dark text-stone-900 text-[13px] font-semibold hover:bg-sand-darker transition-colors">
            Annuler
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 rounded-sm bg-lagon text-white text-[13px] font-semibold hover:bg-lagon-dark transition-colors">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
