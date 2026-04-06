import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Sun, CloudRain, CloudLightning, CloudDrizzle, Loader2 } from 'lucide-react'

const getWeatherInfo = (code) => {
  if (code === 0) return { label: 'Ciel dégagé', icon: Sun, color: 'text-amber-500' }
  if (code >= 1 && code <= 3) return { label: 'Partiellement nuageux', icon: Cloud, color: 'text-blue-400' }
  if (code >= 51 && code <= 67) return { label: 'Pluie légère', icon: CloudDrizzle, color: 'text-blue-500' }
  if (code >= 71 && code <= 77) return { label: 'Averses', icon: CloudRain, color: 'text-blue-600' }
  if (code >= 80 && code <= 82) return { label: 'Pluie forte', icon: CloudRain, color: 'text-blue-700' }
  if (code >= 95) return { label: 'Orage', icon: CloudLightning, color: 'text-purple-600' }
  return { label: 'Nuageux', icon: Cloud, color: 'text-stone-500' }
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  
  useEffect(() => {
    // Péreybère / Grand Baie
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-19.9934&longitude=57.5878&current=temperature_2m,weather_code&timezone=Indian%2FMahe')
      .then(res => res.json())
      .then(data => {
        if (data.current) setWeather(data.current)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] p-4 sm:p-5 flex flex-col justify-center items-center"
    >
      <div className="text-lagon-dark font-display text-sm font-bold mb-3 uppercase tracking-widest opacity-60">
        Péreybère, Maurice
      </div>
      
      {!weather ? (
        <Loader2 className="animate-spin text-stone-400 my-3" size={28} />
      ) : (
        <div className="flex items-center gap-5">
          {(() => {
            const info = getWeatherInfo(weather.weather_code)
            const Icon = info.icon
            return (
              <>
                <Icon size={46} strokeWidth={1.5} className={info.color} />
                <div className="flex flex-col">
                  <span className="text-[2.5rem] leading-none font-display font-bold text-stone-800 tracking-tighter">
                    {Math.round(weather.temperature_2m)}°
                  </span>
                  <span className="text-sm font-medium text-stone-500">{info.label}</span>
                </div>
              </>
            )
          })()}
        </div>
      )}
    </motion.div>
  )
}
