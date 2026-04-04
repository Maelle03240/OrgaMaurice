import { useMemo } from 'react'
import ChronoCard from './ChronoCard'
import { getAllTripDays } from '../lib/dates'

export default function ChronoList({
  filter, dayPlans, activities, dayTypes, showPlanned, highlightDay,
  onToggleCar, onAddActivity, onRemoveActivity, onRemoveDayType
}) {
  const days = useMemo(() => {
    let keys = getAllTripDays(filter)
    if (showPlanned) {
      keys = keys.filter(k => {
        const p = dayPlans[k]
        return p && ((p.activity_entries?.length > 0) || p.notes?.trim() || p.day_type_id)
      })
    }
    return keys
  }, [filter, dayPlans, showPlanned])

  if (!days.length) {
    return (
      <div className="text-center py-8 text-[13px] text-stone-400">
        Aucun jour à afficher.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {days.map(k => (
        <ChronoCard
          key={k}
          dateKey={k}
          plan={dayPlans[k]}
          activities={activities}
          dayTypes={dayTypes}
          highlight={k === highlightDay}
          onToggleCar={onToggleCar}
          onAddActivity={onAddActivity}
          onRemoveActivity={onRemoveActivity}
          onRemoveDayType={onRemoveDayType}
        />
      ))}
    </div>
  )
}
