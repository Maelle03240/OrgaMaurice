export const TRIP_START = new Date(2026, 2, 18) // 18 mars 2026
export const TRIP_END = new Date(2026, 5, 21)   // 21 juin 2026
export const PARENTS_START = new Date(2026, 3, 5)  // 5 avril
export const PARENTS_END = new Date(2026, 3, 17)   // 17 avril
export const CONGE_START = new Date(2026, 3, 7)     // 7 avril
export const CONGE_END = new Date(2026, 3, 10)      // 10 avril

export const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
export const DAYS_LONG = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
export const DAYS_SHORT = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

export const ICON_MAP = {
  plage: '🏖', rando: '🥾', culture: '🏛', sport: '🏄',
  resto: '🍽', excursion: '⛵', spa: '💆', shopping: '🛍', autre: '📌'
}

export const SLOTS = {
  matin:   { label: '🌅 Matin',      order: 0, color: '#FEF3D0', text: '#6B4A10' },
  aprem:   { label: '☀️ Après-midi', order: 1, color: '#FAD9CC', text: '#7A3018' },
  soir:    { label: '🌙 Soir',       order: 2, color: '#EDE9F5', text: '#4A3D72' },
  journee: { label: '📅 Journée',    order: 3, color: '#D6F0F7', text: '#0D5F78' },
}

export const TYPE_LABELS = {
  plage: '🏖 Plage / Mer', rando: '🥾 Rando', culture: '🏛 Culture',
  sport: '🏄 Sport', resto: '🍽 Resto', excursion: '⛵ Excursion',
  spa: '💆 Spa', shopping: '🛍 Shopping', autre: '📌 Autre'
}

// Day of week (monday-first: 0=lundi ... 6=dimanche)
export function dow(date) {
  return (date.getDay() + 6) % 7
}

// Date key "YYYY-MM-DD"
export function dk(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseKey(k) {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function inTrip(date) {
  return date >= TRIP_START && date <= TRIP_END
}

export function inParentsTrip(date) {
  return date >= PARENTS_START && date <= PARENTS_END
}

export function isConge(date) {
  return date >= CONGE_START && date <= CONGE_END
}

export function formatFR(date) {
  return `${DAYS_LONG[dow(date)]} ${date.getDate()} ${MONTHS_FR[date.getMonth()]}`
}

export function formatShort(date) {
  return `${date.getDate()} ${MONTHS_FR[date.getMonth()].slice(0,3)}`
}

// Determine the "type" of a day for MY calendar
export function dtype(date) {
  const m = date.getMonth(), d = date.getDate()
  if (date < TRIP_START) return 'avant'
  if (date > TRIP_END) return 'apres'
  // Avril (m=3) : période parents
  if (m === 3) {
    if (d === 5) return 'transit'
    if (d >= 6 && d <= 16) return 'pv'      // toute la période parents = saumon
    if (d === 17) return 'dep-p'
  }
  // Mars + début avril : avec sœur
  if ((m === 2 && d >= 18) || (m === 3 && d <= 4)) return 'soeur'
  // Mai (m=4) : solo
  if (m === 4) return 'solo'
  // Juin (m=5) : Maël
  if (m === 5) {
    if (d === 21) return 'dep'
    if (d >= 20) return 'cv'               // vacances Maël
    return 'mael'                           // 16-19 juin = Maëlle garde couleur mael
  }
  return 'def'
}

// Returns true if this date is a personal Maëlle day (congé or vacation)
// Used to overlay the 🌴 palmier WITHOUT changing the period color
export function isMaelleDay(date) {
  const m = date.getMonth(), d = date.getDate()
  if (m === 3 && d >= 7 && d <= 10) return true   // congé avril (7-10 seulement)
  if (m === 5 && d >= 16 && d <= 19) return true   // vacances juin
  return false
}


// Parents day type
export function dtypeParents(date) {
  if (!inParentsTrip(date)) return null
  const d = date.getDate()
  if (d === 5) return 'transit'            // arrivée
  if (d >= 6 && d <= 16) return 'pv'      // toute la période = saumon
  if (d === 17) return 'transit'           // départ
  return 'pv'
}

export const DT_COLORS = {
  avant:    { bg: '#EDEAE3', text: '#BBB' },
  transit:  { bg: '#E2DDD4', text: '#888' },
  soeur:    { bg: '#C8EDD0', text: '#1B4332' },
  pv:       { bg: '#FAD9CC', text: '#7A3018' },
  ps:       { bg: '#EDE9F5', text: '#4A3D72' },
  pl:       { bg: '#E8F4EB', text: '#2D5A27', border: '1.5px dashed #74C281' },
  solo:     { bg: '#D6F0F7', text: '#0D5F78' },
  mael:     { bg: '#EDE9F5', text: '#4A3D72' },          // 💜 Maël — lilas
  cv:       { bg: '#D9D0F0', text: '#3A2D6A' },          // 💜 Vacances Maël — lilas foncé
  dep:      { bg: '#FEF3D0', text: '#6B4A10' },
  'dep-p':  { bg: '#FEF3D0', text: '#6B4A10' },
  def:      { bg: '#EDE4CC', text: '#7A6A5A' },
}

export const DT_ACCENT = {
  soeur: '#2D6A4F', pv: '#E07B54', ps: '#7B6FA0', pl: '#2D6A4F',
  transit: '#888', mael: '#7B6FA0', cv: '#5A4F90', solo: '#7B6FA0',
  dep: '#D4A843', 'dep-p': '#D4A843', def: '#1B8FAD',
}

export const DT_BADGES = {
  soeur:    { label: '🌿 Sœur',            cls: 'bg-[#C8EDD0] text-[#1B4332]' },
  pv:       { label: '☀️ Vacances parents', cls: 'bg-[#FAD9CC] text-[#7A3018]' },
  ps:       { label: '🤿 Sous-marin ★',   cls: 'bg-[#EDE9F5] text-[#4A3D72]' },
  pl:       { label: 'À planifier',         cls: 'bg-[#D8F3DC] text-[#1B4332] border border-dashed border-[#2D6A4F]' },
  transit:  { label: 'Arrivée/Départ',      cls: 'bg-[#EDE4CC] text-[#7A6A5A]' },
  mael:     { label: '💜 Maël',             cls: 'bg-[#EDE9F5] text-[#4A3D72]' },
  cv:       { label: '💜 Vacances Maël',   cls: 'bg-[#D9D0F0] text-[#3A2D6A]' },
  solo:     { label: '🌊 Solo',              cls: 'bg-[#D6F0F7] text-[#0D5F78]' },
  dep:      { label: '✈ Départ',           cls: 'bg-[#FEF3D0] text-[#6B4A10]' },
  'dep-p':  { label: '✈ Départ parents',   cls: 'bg-[#FEF3D0] text-[#6B4A10]' },
}

// Filter logic for MY calendar
export function matchesFilter(dateKey, filter) {
  const date = parseKey(dateKey)
  const dt = dtype(date)
  if (filter === 'tous') return true
  if (filter === 'soeur') return dt === 'soeur'
  if (filter === 'meparents') return dt === 'pv' || dt === 'ps' || dt === 'pl' || dt === 'transit' || dt === 'dep-p'
  if (filter === 'copain') return dt === 'mael' || dt === 'cv' || dt === 'dep'
  return true
}

// Get all trip days matching a filter
export function getAllTripDays(filter = 'tous') {
  const keys = []
  let cur = new Date(TRIP_START)
  while (cur <= TRIP_END) {
    const key = dk(cur)
    if (matchesFilter(key, filter)) keys.push(key)
    cur = new Date(cur.getTime() + 86400000)
  }
  return keys
}

// Get all parent trip days
export function getAllParentDays() {
  const keys = []
  let cur = new Date(PARENTS_START)
  while (cur <= PARENTS_END) {
    keys.push(dk(cur))
    cur = new Date(cur.getTime() + 86400000)
  }
  return keys
}

// Get N days starting from a date (for 15-day calendar)
export function getFortnight(startDate) {
  const days = []
  for (let i = 0; i < 14; i++) {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + i)
    days.push(day)
  }
  return days
}

// Dot color for activity type
export function dotColor(type) {
  const map = {
    plage: '#1B8FAD', rando: '#2D6A4F', culture: '#D4A843', sport: '#E07B54',
    resto: '#7B6FA0', excursion: '#0D5F78', spa: '#B07B9A', shopping: '#C8B98A', autre: '#888'
  }
  return map[type] || '#CCC'
}
