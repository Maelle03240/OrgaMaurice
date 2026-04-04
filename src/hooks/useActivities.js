import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useActivities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error && data) setActivities(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const create = async (activity) => {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single()
    if (!error && data) {
      setActivities(prev => [...prev, data])
      return data
    }
    return null
  }

  const remove = async (id) => {
    await supabase.from('activities').delete().eq('id', id)
    setActivities(prev => prev.filter(a => a.id !== id))
  }

  return { activities, loading, create, remove, refetch: fetchAll }
}
