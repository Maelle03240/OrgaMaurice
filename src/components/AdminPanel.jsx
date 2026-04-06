import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pencil, Trash2, Plus, Check } from 'lucide-react'
import { ICON_MAP, TYPE_LABELS } from '../lib/dates'

const EMPTY_ACT = { name: '', type: 'plage', lieu: '', prix: '', notes: '' }
const EMPTY_JT = { name: '', icon: '', description: '', color: '#1B8FAD', activity_ids: [], activity_options: [] }

function ActivityForm({ initial = EMPTY_ACT, onSave, onCancel, activities }) {
  const [form, setForm] = useState({ ...EMPTY_ACT, ...initial, prix: initial.prix ?? '' })
  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))
  return (
    <div className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] p-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Nom</label>
          <input className="input" value={form.name} onChange={set('name')} placeholder="Ex: Snorkeling Blue Bay" />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Type</label>
          <select className="input appearance-none" value={form.type} onChange={set('type')}>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Lieu</label>
          <input className="input" value={form.lieu} onChange={set('lieu')} placeholder="Ex: Blue Bay, côte sud" />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Prix estimé (€)</label>
          <input className="input" type="number" value={form.prix} onChange={set('prix')} placeholder="0 = gratuit" />
        </div>
      </div>
      <div className="mt-3">
        <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Notes</label>
        <textarea className="input resize-none min-h-[60px]" value={form.notes} onChange={set('notes')} placeholder="Infos pratiques, lien de résa..." />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onSave({ ...form, prix: parseFloat(form.prix) || 0 })}
          className="flex items-center gap-1.5 px-5 py-2 rounded-sm bg-lagon text-white text-[13px] font-semibold hover:bg-lagon-dark transition-colors"
        >
          <Check size={14} /> Sauvegarder
        </button>
        <button onClick={onCancel} className="px-5 py-2 rounded-sm bg-sand-dark text-stone-900 text-[13px] font-semibold hover:bg-sand-darker transition-colors">
          Annuler
        </button>
      </div>
    </div>
  )
}

function DayTypeForm({ initial = EMPTY_JT, activities, onSave, onCancel }) {
  const [form, setForm] = useState({ 
    ...EMPTY_JT, 
    ...initial, 
    activity_ids: [...(initial.activity_ids || [])],
    activity_options: [...(initial.activity_options || [])]
  })
  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))
  
  const toggleAct = (id) => setForm(prev => {
    const isSelected = prev.activity_ids.includes(id)
    return {
      ...prev,
      activity_ids: isSelected ? prev.activity_ids.filter(a => a !== id) : [...prev.activity_ids, id],
      activity_options: isSelected ? prev.activity_options.filter(a => a !== id) : prev.activity_options
    }
  })

  const toggleOption = (id) => setForm(prev => ({
    ...prev,
    activity_options: prev.activity_options.includes(id)
      ? prev.activity_options.filter(a => a !== id)
      : [...prev.activity_options, id]
  }))

  return (
    <div className="bg-cream rounded-card border border-black/10 shadow-[0_2px_16px_rgba(0,0,0,.07)] p-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Nom de la journée</label>
          <input className="input" value={form.name} onChange={set('name')} placeholder="Ex: Sud Sauvage · Cascades" />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Emoji</label>
          <input className="input text-center text-xl" value={form.icon} onChange={set('icon')} placeholder="🌊" maxLength={4} />
        </div>
      </div>
      <div className="mt-3">
        <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Description</label>
        <input className="input" value={form.description} onChange={set('description')} placeholder="Une phrase résumant la journée" />
      </div>
      <div className="mt-3">
        <label className="block text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-1">Couleur</label>
        <select className="input appearance-none" value={form.color} onChange={set('color')}>
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
              onClick={() => toggleAct(a.id)}
              className={`text-xs font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-all ${
                form.activity_ids.includes(a.id)
                  ? 'bg-lagon-light border-lagon text-lagon-dark'
                  : 'border-black/10 bg-sand text-stone-400 hover:bg-sand-dark'
              }`}
            >
              {ICON_MAP[a.type] || '📌'} {a.name}
            </button>
          ))}
        </div>
        <div className="min-h-[38px] border-[1.5px] border-dashed border-black/10 rounded-sm px-3 py-2 flex flex-col gap-2">
          {form.activity_ids.length > 0 ? form.activity_ids.map(id => {
            const a = activities.find(x => x.id === id)
            if (!a) return null
            const isOption = form.activity_options.includes(id)
            return (
              <div key={id} className={`flex items-center gap-2 justify-between px-2.5 py-1.5 rounded-sm border transition-all ${
                isOption ? 'bg-sand/40 border-dashed border-black/10' : 'bg-lagon-light border-lagon/20'
              }`}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`text-[12px] font-medium truncate ${isOption ? 'text-stone-500' : 'text-lagon-dark'}`}>
                    {a.name}
                  </span>
                  {isOption && (
                    <span className="text-[9px] font-bold px-1 py-px rounded-full border border-stone-300 text-stone-400 uppercase tracking-wider shrink-0">
                      option
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={() => toggleOption(id)} 
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border transition-all ${
                      isOption 
                        ? 'border-stone-300 bg-stone-100 text-stone-400 hover:text-coral' 
                        : 'border-lagon/30 text-lagon hover:bg-lagon hover:text-white'
                    }`}
                    title="Définir comme option dans cette journée"
                  >
                    opt
                  </button>
                  <button onClick={() => toggleAct(id)} className="text-stone-400 hover:text-coral p-0.5">✕</button>
                </div>
              </div>
            )
          }) : (
            <span className="text-xs text-stone-400 italic">Aucune</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onSave({ ...form, icon: form.icon || '📅' })}
          className="flex items-center gap-1.5 px-5 py-2 rounded-sm bg-lagon text-white text-[13px] font-semibold hover:bg-lagon-dark transition-colors"
        >
          <Check size={14} /> Sauvegarder
        </button>
        <button onClick={onCancel} className="px-5 py-2 rounded-sm bg-sand-dark text-stone-900 text-[13px] font-semibold hover:bg-sand-darker transition-colors">
          Annuler
        </button>
      </div>
    </div>
  )
}

export default function AdminPanel({
  activities, dayTypes,
  onCreateActivity, onUpdateActivity, onDeleteActivity,
  onCreateDayType, onUpdateDayType, onDeleteDayType
}) {
  const [tab, setTab] = useState('act')
  const [editingActId, setEditingActId] = useState(null)  // id being edited, or 'new'
  const [editingJtId, setEditingJtId] = useState(null)    // id being edited, or 'new'

  // ── Activities ──────────────────────────────────────
  const handleSaveAct = async (form) => {
    if (!form.name.trim()) { alert('Donne un nom !'); return }
    if (editingActId === 'new') {
      const result = await onCreateActivity(form)
      if (result) setEditingActId(null)
    } else {
      const result = await onUpdateActivity(editingActId, form)
      if (result) setEditingActId(null)
    }
  }

  // ── Day types ──────────────────────────────────────
  const handleSaveJt = async (form) => {
    if (!form.name.trim()) { alert('Donne un nom !'); return }
    if (editingJtId === 'new') {
      const result = await onCreateDayType(form)
      if (result) setEditingJtId(null)
    } else {
      const result = await onUpdateDayType(editingJtId, form)
      if (result) setEditingJtId(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[820px] mx-auto px-5 py-8 pb-16"
    >
      <h2 className="font-display text-2xl font-bold text-lilac mb-1">⚙ Mode Admin</h2>
      <p className="text-[13px] text-stone-400 mb-5">Crée, modifie et gère tes activités et journées types</p>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6">
        <button
          onClick={() => setTab('act')}
          className={`text-[13px] font-medium px-4 py-1.5 rounded-full border-[1.5px] transition-all ${
            tab === 'act' ? 'bg-lilac text-white border-transparent' : 'border-black/10 bg-white/50 text-stone-500 hover:bg-white/90'
          }`}
        >
          🏖 Activités
        </button>
        <button
          onClick={() => setTab('jtype')}
          className={`text-[13px] font-medium px-4 py-1.5 rounded-full border-[1.5px] transition-all ${
            tab === 'jtype' ? 'bg-lilac text-white border-transparent' : 'border-black/10 bg-white/50 text-stone-500 hover:bg-white/90'
          }`}
        >
          📅 Journées types
        </button>
      </div>

      {tab === 'act' ? (
        <div>
          {/* New/edit form */}
          <AnimatePresence>
            {editingActId && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5">
                <div className="text-[11px] uppercase tracking-wider text-lilac font-semibold mb-2">
                  {editingActId === 'new' ? '+ Nouvelle activité' : '✏ Modifier l\'activité'}
                </div>
                <ActivityForm
                  initial={editingActId === 'new' ? EMPTY_ACT : activities.find(a => a.id === editingActId)}
                  activities={activities}
                  onSave={handleSaveAct}
                  onCancel={() => setEditingActId(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!editingActId && (
            <button
              onClick={() => setEditingActId('new')}
              className="flex items-center gap-1.5 mb-4 px-4 py-2 rounded-sm bg-lilac text-white text-[13px] font-semibold hover:bg-lilac/90 transition-colors"
            >
              <Plus size={14} /> Nouvelle activité
            </button>
          )}

          {/* List */}
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium mb-2 pb-1 border-b border-black/10">
            {activities.length} activité{activities.length !== 1 ? 's' : ''} existante{activities.length !== 1 ? 's' : ''}
          </div>
          <div className="space-y-1.5">
            {activities.map(a => (
              <div key={a.id} className={`flex items-center gap-3 px-3 py-2.5 bg-cream rounded-sm border transition-all ${editingActId === a.id ? 'border-lilac shadow-sm' : 'border-black/10'}`}>
                <span className="text-base">{ICON_MAP[a.type] || '📌'}</span>
                <span className="flex-1 text-[13px] font-medium">{a.name}</span>
                <span className="text-[11px] text-stone-400 hidden sm:block">{a.lieu} · {a.prix > 0 ? a.prix + '€' : 'Gratuit'}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingActId(editingActId === a.id ? null : a.id)}
                    className="p-1.5 rounded-sm text-stone-400 hover:text-lilac hover:bg-lilac/10 transition-all"
                    title="Modifier"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteActivity(a.id)}
                    className="p-1.5 rounded-sm text-stone-400 opacity-40 hover:opacity-100 hover:text-coral hover:bg-coral/10 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* New/edit form */}
          <AnimatePresence>
            {editingJtId && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5">
                <div className="text-[11px] uppercase tracking-wider text-lilac font-semibold mb-2">
                  {editingJtId === 'new' ? '+ Nouvelle journée type' : '✏ Modifier la journée'}
                </div>
                <DayTypeForm
                  initial={editingJtId === 'new' ? EMPTY_JT : dayTypes.find(j => j.id === editingJtId)}
                  activities={activities}
                  onSave={handleSaveJt}
                  onCancel={() => setEditingJtId(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!editingJtId && (
            <button
              onClick={() => setEditingJtId('new')}
              className="flex items-center gap-1.5 mb-4 px-4 py-2 rounded-sm bg-lilac text-white text-[13px] font-semibold hover:bg-lilac/90 transition-colors"
            >
              <Plus size={14} /> Nouvelle journée type
            </button>
          )}

          {/* List */}
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium mb-2 pb-1 border-b border-black/10">
            {dayTypes.length} journée{dayTypes.length !== 1 ? 's' : ''} type{dayTypes.length !== 1 ? 's' : ''} existante{dayTypes.length !== 1 ? 's' : ''}
          </div>
          <div className="space-y-1.5">
            {dayTypes.map(j => (
              <div key={j.id} className={`flex items-center gap-3 px-3 py-2.5 bg-cream rounded-sm border transition-all ${editingJtId === j.id ? 'border-lilac shadow-sm' : 'border-black/10'}`}>
                <span className="text-base">{j.icon}</span>
                <span className="flex-1 text-[13px] font-medium">{j.name}</span>
                <span className="text-[11px] text-stone-400">{(j.activity_ids || []).length} act.</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingJtId(editingJtId === j.id ? null : j.id)}
                    className="p-1.5 rounded-sm text-stone-400 hover:text-lilac hover:bg-lilac/10 transition-all"
                    title="Modifier"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteDayType(j.id)}
                    className="p-1.5 rounded-sm text-stone-400 opacity-40 hover:opacity-100 hover:text-coral hover:bg-coral/10 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
