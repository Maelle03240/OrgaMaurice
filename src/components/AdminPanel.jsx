import { useState } from 'react'
import { motion } from 'framer-motion'
import { ICON_MAP, TYPE_LABELS } from '../lib/dates'

export default function AdminPanel({ activities, dayTypes, onCreateActivity, onDeleteActivity, onCreateDayType, onDeleteDayType }) {
  const [tab, setTab] = useState('act')

  // Activity form state
  const [aName, setAName] = useState('')
  const [aType, setAType] = useState('plage')
  const [aLieu, setALieu] = useState('')
  const [aPrix, setAPrix] = useState('')
  const [aNotes, setANotes] = useState('')

  // Day type form state
  const [jtName, setJtName] = useState('')
  const [jtIcon, setJtIcon] = useState('')
  const [jtDesc, setJtDesc] = useState('')
  const [jtColor, setJtColor] = useState('#1B8FAD')
  const [jtSelectedActs, setJtSelectedActs] = useState([])

  const handleSaveAct = async () => {
    if (!aName.trim()) { alert('Donne un nom !'); return }
    const result = await onCreateActivity({
      name: aName.trim(),
      type: aType,
      lieu: aLieu.trim(),
      prix: parseFloat(aPrix) || 0,
      notes: aNotes.trim()
    })
    if (result) {
      setAName(''); setALieu(''); setAPrix(''); setANotes('')
    }
  }

  const handleSaveJtype = async () => {
    if (!jtName.trim()) { alert('Donne un nom !'); return }
    const result = await onCreateDayType({
      name: jtName.trim(),
      icon: jtIcon.trim() || '📅',
      description: jtDesc.trim(),
      color: jtColor,
      activity_ids: jtSelectedActs
    })
    if (result) {
      setJtName(''); setJtIcon(''); setJtDesc(''); setJtSelectedActs([])
    }
  }

  const toggleActSel = (id) => {
    setJtSelectedActs(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[780px] mx-auto px-5 pb-10"
    >
      <hr className="border-black/10 my-5" />
      <h2 className="font-display text-2xl font-bold text-lilac mb-1">⚙ Mode Admin</h2>
      <p className="text-[13px] text-stone-400 mb-5">Crée et gère tes activités et journées types</p>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4">
        <button
          onClick={() => setTab('act')}
          className={`text-[13px] font-medium px-4 py-1.5 rounded-full border-[1.5px] transition-all ${
            tab === 'act' ? 'bg-lilac text-white border-transparent' : 'border-black/10 bg-white/50 text-stone-500'
          }`}
        >
          Nouvelle activité
        </button>
        <button
          onClick={() => setTab('jtype')}
          className={`text-[13px] font-medium px-4 py-1.5 rounded-full border-[1.5px] transition-all ${
            tab === 'jtype' ? 'bg-lilac text-white border-transparent' : 'border-black/10 bg-white/50 text-stone-500'
          }`}
        >
          Nouvelle journée type
        </button>
      </div>

      {tab === 'act' ? (
        <div>
          <div className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] p-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Nom</label>
                <input className="w-full px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon transition-colors" value={aName} onChange={e => setAName(e.target.value)} placeholder="Ex: Snorkeling Blue Bay" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Type</label>
                <select className="w-full px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon appearance-none" value={aType} onChange={e => setAType(e.target.value)}>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Lieu</label>
                <input className="w-full px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon" value={aLieu} onChange={e => setALieu(e.target.value)} placeholder="Ex: Blue Bay, côte sud" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Prix estimé (€)</label>
                <input className="w-full px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon" type="number" value={aPrix} onChange={e => setAPrix(e.target.value)} placeholder="0 = gratuit" />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Notes</label>
              <input className="w-full px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon" value={aNotes} onChange={e => setANotes(e.target.value)} placeholder="Infos pratiques, lien de résa..." />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSaveAct} className="px-5 py-2 rounded-sm bg-lagon text-white text-[13px] font-semibold hover:bg-lagon-dark transition-colors">
                Sauvegarder
              </button>
              <button onClick={() => { setAName(''); setALieu(''); setAPrix(''); setANotes('') }} className="px-5 py-2 rounded-sm bg-sand-dark text-stone-900 text-[13px] font-semibold hover:bg-sand-darker transition-colors">
                Effacer
              </button>
            </div>
          </div>
          {/* Existing activities */}
          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium mb-2 pb-1 border-b border-black/10">
              Activités existantes
            </div>
            <div className="space-y-1.5">
              {activities.map(a => (
                <div key={a.id} className="flex items-center gap-3 px-3 py-2 bg-cream rounded-sm border border-black/10">
                  <span className="text-base">{ICON_MAP[a.type] || '📌'}</span>
                  <span className="flex-1 text-[13px] font-medium">{a.name}</span>
                  <span className="text-[11px] text-stone-400">{a.lieu} · {a.prix > 0 ? a.prix + '€' : 'Gratuit'}</span>
                  <button onClick={() => onDeleteActivity(a.id)} className="text-stone-400 opacity-40 hover:opacity-100 hover:text-coral transition-all">🗑</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] p-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Nom de la journée</label>
                <input className="w-full px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon" value={jtName} onChange={e => setJtName(e.target.value)} placeholder="Ex: Sud Sauvage · Cascades" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Emoji</label>
                <input className="w-full px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon text-center text-xl" value={jtIcon} onChange={e => setJtIcon(e.target.value)} placeholder="🌊" maxLength={4} />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Description</label>
              <input className="w-full px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon" value={jtDesc} onChange={e => setJtDesc(e.target.value)} placeholder="Une phrase résumant la journée" />
            </div>
            <div className="mt-3">
              <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Couleur</label>
              <select className="w-full px-3 py-2 rounded-sm border-[1.5px] border-black/10 bg-sand text-[13px] font-body outline-none focus:border-lagon appearance-none" value={jtColor} onChange={e => setJtColor(e.target.value)}>
                <option value="#1B8FAD">🔵 Bleu lagon</option>
                <option value="#2D6A4F">🟢 Jungle</option>
                <option value="#E07B54">🟠 Corail</option>
                <option value="#D4A843">🟡 Sunset</option>
                <option value="#7B6FA0">🟣 Lilas</option>
              </select>
            </div>
            <div className="mt-3">
              <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Activités de cette journée</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {activities.map(a => (
                  <button
                    key={a.id}
                    onClick={() => toggleActSel(a.id)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-all ${
                      jtSelectedActs.includes(a.id)
                        ? 'bg-lagon-light border-lagon text-lagon-dark'
                        : 'border-black/10 bg-sand text-stone-400'
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-stone-400 mb-1">Sélectionnées :</div>
              <div className="min-h-[38px] border-[1.5px] border-dashed border-black/10 rounded-sm px-3 py-2 flex flex-wrap gap-1.5 items-center">
                {jtSelectedActs.length > 0 ? jtSelectedActs.map(id => {
                  const a = activities.find(x => x.id === id)
                  return a ? (
                    <span key={id} className="text-[11px] px-2 py-0.5 rounded-full bg-lagon-light text-lagon-dark flex items-center gap-1">
                      {a.name}
                      <button onClick={() => toggleActSel(id)} className="text-lagon-dark text-xs">✕</button>
                    </span>
                  ) : null
                }) : (
                  <span className="text-xs text-stone-400 italic">Aucune</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSaveJtype} className="px-5 py-2 rounded-sm bg-lagon text-white text-[13px] font-semibold hover:bg-lagon-dark transition-colors">
                Sauvegarder
              </button>
              <button onClick={() => { setJtName(''); setJtIcon(''); setJtDesc(''); setJtSelectedActs([]) }} className="px-5 py-2 rounded-sm bg-sand-dark text-stone-900 text-[13px] font-semibold hover:bg-sand-darker transition-colors">
                Effacer
              </button>
            </div>
          </div>
          {/* Existing day types */}
          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium mb-2 pb-1 border-b border-black/10">
              Journées types existantes
            </div>
            <div className="space-y-1.5">
              {dayTypes.map(j => (
                <div key={j.id} className="flex items-center gap-3 px-3 py-2 bg-cream rounded-sm border border-black/10">
                  <span className="text-base">{j.icon}</span>
                  <span className="flex-1 text-[13px] font-medium">{j.name}</span>
                  <span className="text-[11px] text-stone-400">{(j.activity_ids || []).length} act.</span>
                  <button onClick={() => onDeleteDayType(j.id)} className="text-stone-400 opacity-40 hover:opacity-100 hover:text-coral transition-all">🗑</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
