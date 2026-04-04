import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Settings } from 'lucide-react'

const FILTERS = [
  { id: 'tous', label: '📅 Tout mon séjour' },
  { id: 'soeur', label: '🌿 Avec ma sœur' },
  { id: 'meparents', label: '☀️ Avec mes parents' },
  { id: 'copain', label: '🌺 Avec mon copain' },
]

export default function TopBar({ isParentsView, filter, onFilterChange, onParentsView, onMyView, adminOpen, onToggleAdmin }) {
  const [ddOpen, setDdOpen] = useState(false)
  const ddRef = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false) }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#F7F1E3]/95 backdrop-blur-lg border-b border-black/10">
      <div className="flex items-center gap-1 px-3 py-2 sm:gap-2 sm:px-4">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display text-sm font-bold text-lagon-dark hover:text-lagon transition-colors shrink-0 sm:text-[15px]"
        >
          🌴 Maurice
        </button>
        <div className="w-px h-4 bg-black/10 shrink-0 hidden sm:block" />

        {/* Moi dropdown */}
        <div className="relative" ref={ddRef}>
          <button
            onClick={(e) => { e.stopPropagation(); if (isParentsView) { onMyView(); } else { setDdOpen(!ddOpen) } }}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-all flex items-center gap-0.5 sm:text-xs sm:px-3 ${
              !isParentsView ? 'bg-lagon text-white border-transparent shadow-md' : 'border-black/10 bg-white/50 text-stone-500 hover:bg-white/90'
            }`}
          >
            Moi <ChevronDown size={11} />
          </button>
          {ddOpen && !isParentsView && (
            <div className="absolute top-full mt-1.5 left-0 bg-cream border border-black/10 rounded-sm shadow-xl min-w-[160px] z-50 overflow-hidden animate-slide-in">
              {FILTERS.map((f, i) => (
                <div key={f.id}>
                  {i === 1 && <div className="h-px bg-black/10 my-0.5" />}
                  <button
                    onClick={() => { onFilterChange(f.id); setDdOpen(false) }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-[12px] font-medium transition-colors text-left ${
                      filter === f.id ? 'bg-lagon-light text-lagon-dark font-semibold' : 'hover:bg-sand-dark'
                    }`}
                  >
                    {f.label}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Parents */}
        <button
          onClick={onParentsView}
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-all sm:text-xs sm:px-3 ${
            isParentsView ? 'bg-sunset text-stone-900 border-transparent shadow-md' : 'border-black/10 bg-white/50 text-stone-500 hover:bg-white/90'
          }`}
        >
          Parents
        </button>

        {/* Admin - pushed right */}
        <div className="ml-auto">
          <button
            onClick={onToggleAdmin}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-all flex items-center gap-1 sm:text-xs sm:px-3 ${
              adminOpen ? 'bg-lilac text-white border-transparent shadow-md' : 'border-black/10 bg-white/50 text-stone-500 hover:bg-white/90'
            }`}
          >
            <Settings size={12} /> <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </div>
  )
}
