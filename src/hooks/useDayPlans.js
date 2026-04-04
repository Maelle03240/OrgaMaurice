import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useDayPlans() {
  const [dayPlans, setDayPlans] = useState({})       // keyed by "moi:YYYY-MM-DD"
  const [parentPlans, setParentPlans] = useState({})  // keyed by "parents:YYYY-MM-DD"
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from('day_plans')
      .select('*')
    if (!error && data) {
      const moi = {}, parents = {}
      data.forEach(row => {
        if (row.calendar === 'parents') {
          parents[row.date] = row
        } else {
          moi[row.date] = row
        }
      })
      setDayPlans(moi)
      setParentPlans(parents)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()

    // Real-time subscription: refresh automatically on any change in day_plans
    const channel = supabase
      .channel('day_plans_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'day_plans' },
        () => { fetchAll() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchAll])

  // Generic upsert for a specific calendar
  const upsert = async (date, updates, calendar = 'moi') => {
    const store = calendar === 'parents' ? parentPlans : dayPlans
    const existing = store[date] || {
      date,
      calendar,
      activity_entries: [],
      notes: '',
      has_car: false,
      day_type_id: null
    }
    const merged = { ...existing, ...updates, date, calendar, updated_at: new Date().toISOString() }
    const { data, error } = await supabase
      .from('day_plans')
      .upsert(merged, { onConflict: 'date,calendar' })
      .select()
      .single()
    if (!error && data) {
      if (calendar === 'parents') {
        setParentPlans(prev => ({ ...prev, [date]: data }))
      } else {
        setDayPlans(prev => ({ ...prev, [date]: data }))
      }
      return data
    }
    return null
  }

  const toggleCar = async (date, calendar = 'moi') => {
    const store = calendar === 'parents' ? parentPlans : dayPlans
    const plan = store[date]
    return upsert(date, { has_car: !(plan?.has_car) }, calendar)
  }

  const addActivity = async (date, activityId, count = 1, calendar = 'moi', slot = 'journee') => {
    const store = calendar === 'parents' ? parentPlans : dayPlans
    const plan = store[date]
    const entries = [...(plan?.activity_entries || [])]
    for (let i = 0; i < count; i++) {
      entries.push({ actId: activityId, slot, iid: Date.now() + Math.random() })
    }
    return upsert(date, { activity_entries: entries }, calendar)
  }

  const removeActivity = async (date, index, calendar = 'moi') => {
    const store = calendar === 'parents' ? parentPlans : dayPlans
    const plan = store[date]
    if (!plan) return
    const entries = [...(plan.activity_entries || [])]
    entries.splice(index, 1)
    return upsert(date, { activity_entries: entries }, calendar)
  }

  const setDayType = async (date, dayTypeId, activityIds = [], calendar = 'moi') => {
    const store = calendar === 'parents' ? parentPlans : dayPlans
    const plan = store[date]
    const entries = [...(plan?.activity_entries || [])]
    activityIds.forEach(aid => {
      entries.push({ actId: aid, iid: Date.now() + Math.random() })
    })
    return upsert(date, { day_type_id: dayTypeId, activity_entries: entries }, calendar)
  }

  const removeDayType = async (date, calendar = 'moi') => {
    return upsert(date, { day_type_id: null }, calendar)
  }

  const updateNotes = async (date, notes, calendar = 'moi') => {
    return upsert(date, { notes }, calendar)
  }

  return {
    dayPlans, parentPlans, loading, upsert, toggleCar,
    addActivity, removeActivity, setDayType, removeDayType, updateNotes,
    refetch: fetchAll
  }
}
