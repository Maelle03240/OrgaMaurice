import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useDayTypes() {
  const [dayTypes, setDayTypes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from('day_types')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error && data) setDayTypes(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const create = async (dayType) => {
    const { data, error } = await supabase
      .from('day_types')
      .insert(dayType)
      .select()
      .single()
    if (!error && data) {
      setDayTypes(prev => [...prev, data])
      return data
    }
    return null
  }

  const remove = async (id) => {
    await supabase.from('day_types').delete().eq('id', id)
    setDayTypes(prev => prev.filter(j => j.id !== id))
  }

  return { dayTypes, loading, create, remove, refetch: fetchAll }
}
