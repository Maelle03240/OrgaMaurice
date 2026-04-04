import { useState, useCallback, useRef, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'

import TopBar from './components/TopBar'
import Hero from './components/Hero'
import WeekCalendar from './components/WeekCalendar'
import ParentsCalendar from './components/ParentsCalendar'
import DayPanel from './components/DayPanel'
import ChronoList from './components/ChronoList'
import Library from './components/Library'
import AdminPanel from './components/AdminPanel'
import AddActivityModal from './components/AddActivityModal'
import Toast from './components/Toast'

import { useActivities } from './hooks/useActivities'
import { useDayTypes } from './hooks/useDayTypes'
import { useDayPlans } from './hooks/useDayPlans'
import { TRIP_START, TRIP_END, PARENTS_START, PARENTS_END, parseKey, inParentsTrip } from './lib/dates'

// Returns the Monday of the week containing `date`, clamped to the trip period
function getInitialWeekStart() {
  const today = new Date()
  // Clamp to trip bounds
  const clamped = today < TRIP_START ? new Date(TRIP_START) : today > TRIP_END ? new Date(TRIP_END) : today
  // Find Monday of that week (getDay: 0=Sun, 1=Mon...)
  const day = clamped.getDay()
  const diff = (day === 0 ? -6 : 1 - day) // shift to Monday
  const monday = new Date(clamped)
  monday.setDate(clamped.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

export default function App() {
  // View mode
  const [isParentsView, setIsParentsView] = useState(false)
  const [filter, setFilter] = useState('tous')
  const [selectedDay, setSelectedDay] = useState(null)
  const [weekStart, setWeekStart] = useState(getInitialWeekStart)
  const [adminOpen, setAdminOpen] = useState(false)

  // Bottom section: 'chrono' | 'library'
  const [bottomView, setBottomView] = useState('library')
  const [showPlanned, setShowPlanned] = useState(false)

  // Toast
  const [toastMsg, setToastMsg] = useState('')
  const [toastShow, setToastShow] = useState(false)
  const toastTimer = useRef(null)

  // Modal
  const [modal, setModal] = useState(null)

  // Hooks
  const { activities, create: createActivity, remove: removeActivity } = useActivities()
  const { dayTypes, create: createDayType, remove: removeDayType } = useDayTypes()
  const {
    dayPlans, parentPlans, toggleCar, addActivity, removeActivity: removeDayActivity,
    setDayType, removeDayType: removeDayPlanType, updateNotes
  } = useDayPlans()

  // Current plans based on view
  const currentPlans = isParentsView ? parentPlans : dayPlans
  const currentCalendar = isParentsView ? 'parents' : 'moi'

  // Toast
  const toast = useCallback((msg) => {
    setToastMsg(msg)
    setToastShow(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastShow(false), 2500)
  }, [])

  // View handlers
  const handleMyView = () => {
    setIsParentsView(false)
    setSelectedDay(null)
    setFilter('tous')
    setWeekStart(new Date(TRIP_START))
  }

  const handleParentsView = () => {
    setIsParentsView(true)
    setSelectedDay(null)
  }

  const handleFilterChange = (f) => {
    setFilter(f)
    setSelectedDay(null)
    setIsParentsView(false)
    if (f === 'soeur') setWeekStart(new Date(2026, 2, 18))
    else if (f === 'meparents') setWeekStart(new Date(2026, 3, 5))
    else if (f === 'copain') setWeekStart(new Date(2026, 5, 1))
    else setWeekStart(new Date(TRIP_START))
  }

  const handleSelectDay = (key) => {
    setSelectedDay(key === selectedDay ? null : key)
  }

  // Check if a date is in parents overlap period
  const isOverlapDate = (dateKey) => {
    if (!dateKey) return false
    const date = parseKey(dateKey)
    return inParentsTrip(date)
  }

  // Modal: add activities to a specific day
  const openAddActModal = (dateKey) => {
    setModal({ mode: 'activities', dateKey, showCalendarChoice: false })
  }

  // Modal: use a journée type
  const openUseJtypeModal = (jtId) => {
    const jt = dayTypes.find(j => j.id === jtId)
    if (jt) setModal({ mode: 'jtype', dayType: jt, showCalendarChoice: false })
  }

  // Helper: get the calendars to target for a given date
  // If the date is in parents trip, always sync both calendars
  const getCalendarsForDate = (dateKey) => {
    if (!dateKey) return [currentCalendar]
    const date = parseKey(dateKey)
    if (inParentsTrip(date)) return ['moi', 'parents']
    return [currentCalendar]
  }

  // Modal: add a single activity from library
  const openAddActFromLib = (actId) => {
    const act = activities.find(a => a.id === actId)
    if (act) setModal({ mode: 'singleAct', singleActivity: act, showCalendarChoice: false })
  }

  // Modal confirm
  const handleModalConfirm = async ({ dateKey, activityIds, dayTypeId }) => {
    // Automatically sync to parents calendar if date is in parents trip period
    const calendars = getCalendarsForDate(dateKey)

    for (const c of calendars) {
      if (dayTypeId) {
        await setDayType(dateKey, dayTypeId, activityIds, c)
      } else {
        for (const aid of activityIds) {
          await addActivity(dateKey, aid, 1, c)
        }
      }
    }
    const msg = dayTypeId ? '✓ Journée type ajoutée' : `✓ ${activityIds.length} activité(s) ajoutée(s)`
    if (calendars.length > 1) toast(msg + ' (synchro parents ✓)')
    else toast(msg)

    setModal(null)
    setTimeout(() => {
      const el = document.getElementById(`chr-${dateKey}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }

  // Car toggle — sync to parents if in parents period
  const handleToggleCar = async (dateKey) => {
    const calendars = getCalendarsForDate(dateKey)
    for (const c of calendars) await toggleCar(dateKey, c)
    const plan = currentPlans[dateKey]
    toast(plan?.has_car ? '🚌 Transport retiré' : '🚗 Voiture activée')
  }

  // Remove activity / day type — sync to parents if in parents period
  const handleRemoveAct = async (dateKey, idx) => {
    const calendars = getCalendarsForDate(dateKey)
    for (const c of calendars) await removeDayActivity(dateKey, idx, c)
  }
  const handleRemoveDayType = async (dateKey) => {
    const calendars = getCalendarsForDate(dateKey)
    for (const c of calendars) await removeDayPlanType(dateKey, c)
  }

  // Notes
  const notesTimers = useRef({})
  const handleUpdateNotes = (dateKey, notes) => {
    if (notesTimers.current[dateKey]) clearTimeout(notesTimers.current[dateKey])
    notesTimers.current[dateKey] = setTimeout(() => {
      const calendars = getCalendarsForDate(dateKey)
      calendars.forEach(c => updateNotes(dateKey, notes, c))
    }, 600)
  }

  // Admin handlers
  const handleCreateActivity = async (act) => {
    const result = await createActivity(act)
    if (result) toast(`✓ "${act.name}" sauvegardée`)
    return result
  }
  const handleDeleteActivity = async (id) => {
    if (!confirm('Supprimer cette activité ?')) return
    await removeActivity(id)
    toast('Activité supprimée')
  }
  const handleCreateDayType = async (jt) => {
    const result = await createDayType(jt)
    if (result) toast(`✓ "${jt.name}" sauvegardée`)
    return result
  }
  const handleDeleteDayType = async (id) => {
    if (!confirm('Supprimer ?')) return
    await removeDayType(id)
    toast('Journée type supprimée')
  }

  // Section labels
  const sectionTitle = isParentsView
    ? 'Séjour des parents · 5–17 Avril'
    : { tous: 'Tout le séjour', soeur: 'Avec ma sœur', meparents: 'Avec mes parents', copain: 'Avec mon copain' }[filter] || 'Tout le séjour'

  // Filter for chrono list: parents uses 'parents' filter key internally
  const chronoFilter = isParentsView ? 'parents' : filter

  return (
    <div className="min-h-screen">
      <TopBar
        isParentsView={isParentsView}
        filter={filter}
        onFilterChange={handleFilterChange}
        onParentsView={handleParentsView}
        onMyView={handleMyView}
        adminOpen={adminOpen}
        onToggleAdmin={() => setAdminOpen(!adminOpen)}
      />

      <div className="pt-[44px] sm:pt-[48px]">
        <Hero filter={filter} isParentsView={isParentsView} />

        {/* Main content area */}
        <div className="max-w-[1140px] mx-auto px-3 py-3 sm:px-5 sm:py-4">
          {/* Calendar area */}
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-5 lg:items-start">
            {/* Calendar (sticky on desktop) */}
            <div className="w-full lg:w-[340px] lg:shrink-0 lg:sticky lg:top-[56px]">
              {isParentsView ? (
                <ParentsCalendar
                  parentPlans={parentPlans}
                  activities={activities}
                  selectedDay={selectedDay}
                  onSelectDay={handleSelectDay}
                />
              ) : (
                <WeekCalendar
                  weekStart={weekStart}
                  onWeekChange={setWeekStart}
                  selectedDay={selectedDay}
                  onSelectDay={handleSelectDay}
                  dayPlans={dayPlans}
                  activities={activities}
                />
              )}

              {/* Day panel below calendar on MOBILE only */}
              <div className="lg:hidden">
                <AnimatePresence>
                  {selectedDay && (
                    <DayPanel
                      key={selectedDay}
                      dateKey={selectedDay}
                      dayPlans={currentPlans}
                      activities={activities}
                      dayTypes={dayTypes}
                      onToggleCar={handleToggleCar}
                      onAddActivity={openAddActModal}
                      onRemoveActivity={handleRemoveAct}
                      onRemoveDayType={handleRemoveDayType}
                      onUpdateNotes={handleUpdateNotes}
                      onClose={() => setSelectedDay(null)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right column: day detail on desktop, hint when nothing selected */}
            <div className="flex-1 min-w-0 hidden lg:block">
              <AnimatePresence mode="wait">
                {selectedDay ? (
                  <DayPanel
                    key={selectedDay}
                    dateKey={selectedDay}
                    dayPlans={currentPlans}
                    activities={activities}
                    dayTypes={dayTypes}
                    onToggleCar={handleToggleCar}
                    onAddActivity={openAddActModal}
                    onRemoveActivity={handleRemoveAct}
                    onRemoveDayType={handleRemoveDayType}
                    onUpdateNotes={handleUpdateNotes}
                    onClose={() => setSelectedDay(null)}
                  />
                ) : (
                  <div className="text-center py-8 px-4 text-[13px] text-stone-400 bg-white/40 rounded-card border-[1.5px] border-dashed border-black/10">
                    <span className="inline-block text-2xl mb-2">📅</span><br />
                    Clique sur un jour du calendrier<br />pour en voir le détail ici,<br />ou <strong>scrolle</strong> pour voir tout le séjour.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <hr className="border-black/10 max-w-[1140px] mx-auto" />
        <div className="max-w-[1140px] mx-auto px-3 pb-10 sm:px-5 sm:pb-12">
          {/* Toolbar */}
          <div className="mb-4 py-3 border-b border-black/10">
            <div className="font-display text-base font-bold text-lagon-dark mb-2 sm:text-xl">
              {sectionTitle}
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={() => { setBottomView('chrono'); setShowPlanned(true) }}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-all sm:text-xs sm:px-3 ${
                  bottomView === 'chrono' ? 'bg-lagon text-white border-transparent' : 'border-black/10 bg-white/60 text-stone-400'
                }`}
              >
                ⭐ Planifiés
              </button>
              <button
                onClick={() => setBottomView('library')}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-all sm:text-xs sm:px-3 ${
                  bottomView === 'library' ? 'bg-jungle text-white border-transparent' : 'border-black/10 bg-white/60 text-stone-400'
                }`}
              >
                📚 Bibliothèque
              </button>
            </div>
          </div>

          {/* Content: either chrono or library */}
          {bottomView === 'library' ? (
            <Library
              activities={activities}
              dayTypes={dayTypes}
              onUseJtype={openUseJtypeModal}
              onAddActToDate={openAddActFromLib}
            />
          ) : (
            <ChronoList
              filter={chronoFilter}
              dayPlans={currentPlans}
              activities={activities}
              dayTypes={dayTypes}
              showPlanned={showPlanned}
              highlightDay={selectedDay}
              onToggleCar={handleToggleCar}
              onAddActivity={openAddActModal}
              onRemoveActivity={handleRemoveAct}
              onRemoveDayType={handleRemoveDayType}
            />
          )}
        </div>

        {/* Admin panel */}
        <AnimatePresence>
          {adminOpen && (
            <AdminPanel
              activities={activities}
              dayTypes={dayTypes}
              onCreateActivity={handleCreateActivity}
              onDeleteActivity={handleDeleteActivity}
              onCreateDayType={handleCreateDayType}
              onDeleteDayType={handleDeleteDayType}
            />
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center py-5 text-[11px] text-stone-400 tracking-wide">
          Made with love for Île Maurice · 2026
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <AddActivityModal
          mode={modal.mode}
          dateKey={modal.dateKey}
          activities={activities}
          dayType={modal.dayType}
          singleActivity={modal.singleActivity}
          showCalendarChoice={modal.showCalendarChoice || false}
          onConfirm={handleModalConfirm}
          onClose={() => setModal(null)}
        />
      )}

      <Toast message={toastMsg} show={toastShow} />
    </div>
  )
}
