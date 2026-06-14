import { useState } from 'react'
import { STATUS, STATUS_COLORS, STATUS_LABELS, CATEGORIES } from '../data/ghanaianItems'
import { ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Filter, Search } from 'lucide-react'

export default function StockChecker({ items, updateStatus, updateNotes }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = items.filter(item => {
    const matchCat = filterCategory === 'All' || item.category === filterCategory
    const matchStatus = filterStatus === 'All' || item.status === filterStatus
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchStatus && matchSearch
  })

  const current = filtered[currentIndex]
  const total = filtered.length

  function go(dir) {
    setCurrentIndex(prev => {
      const next = prev + dir
      if (next < 0) return filtered.length - 1
      if (next >= filtered.length) return 0
      return next
    })
    setShowNotes(false)
  }

  function goToIndex(i) {
    setCurrentIndex(Math.max(0, Math.min(i, filtered.length - 1)))
    setShowNotes(false)
  }

  async function setStatus(status) {
    if (!current) return
    await updateStatus(current.id, status)
    // Auto-advance if not the last item
    if (currentIndex < filtered.length - 1) {
      setTimeout(() => go(1), 300)
    }
  }

  async function saveNote() {
    if (!current) return
    await updateNotes(current.id, noteText)
    setShowNotes(false)
  }

  if (items.length === 0) return (
    <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
  )

  if (filtered.length === 0) return (
    <div className="p-4 max-w-lg mx-auto text-center">
      <div className="text-gray-400 mt-8 text-lg">No items match your filters</div>
      <button
        className="mt-4 text-indigo-600 underline"
        onClick={() => { setFilterCategory('All'); setFilterStatus('All'); setSearchQuery('') }}
      >
        Clear filters
      </button>
    </div>
  )

  const colors = current ? STATUS_COLORS[current.status] : {}

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Search + Filter toggle */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentIndex(0) }}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-sm ${showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200 text-gray-600'}`}
        >
          <Filter size={15} /> Filter
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-3 border border-gray-100 mb-3 shadow-sm space-y-2">
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">Category</div>
            <div className="flex flex-wrap gap-1">
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setFilterCategory(cat); setCurrentIndex(0) }}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {cat === 'All' ? 'All' : cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">Status</div>
            <div className="flex gap-1">
              {['All', 'in_stock', 'low_stock', 'out_of_stock'].map(s => (
                <button
                  key={s}
                  onClick={() => { setFilterStatus(s); setCurrentIndex(0) }}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {s === 'All' ? 'All' : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{currentIndex + 1} of {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(total, 8) }).map((_, i) => {
            const idx = Math.floor((i / Math.min(total, 8)) * total)
            return (
              <div
                key={i}
                onClick={() => goToIndex(idx)}
                className={`h-1.5 rounded-full cursor-pointer transition-all ${idx === currentIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-gray-200'}`}
              />
            )
          })}
        </div>
        <span className="text-sm text-gray-400">{Math.round(((currentIndex + 1) / total) * 100)}%</span>
      </div>

      {/* Main Card */}
      {current && (
        <div className={`bg-white rounded-3xl shadow-sm border-2 ${colors.border || 'border-gray-200'} overflow-hidden mb-4`}>
          <div className={`${colors.bg || 'bg-gray-50'} px-6 py-8 text-center`}>
            <div className="text-6xl mb-3">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800">{current.name}</h2>
            <div className="text-sm text-gray-400 mt-1">{current.category}</div>
            <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border} text-sm font-medium`}>
              <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
              {STATUS_LABELS[current.status]}
            </div>
          </div>

          {/* Note */}
          {current.notes && !showNotes && (
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 text-sm text-amber-700">
              📝 {current.notes}
            </div>
          )}

          {/* Status buttons */}
          <div className="p-4">
            <div className="text-xs text-gray-400 text-center mb-3">Set stock status:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setStatus(STATUS.IN_STOCK)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all ${current.status === STATUS.IN_STOCK ? 'bg-green-50 border-green-400' : 'border-gray-200 hover:border-green-300 hover:bg-green-50'}`}
              >
                <CheckCircle2 size={20} className={current.status === STATUS.IN_STOCK ? 'text-green-600' : 'text-gray-400'} />
                <span className={`text-xs font-medium ${current.status === STATUS.IN_STOCK ? 'text-green-700' : 'text-gray-500'}`}>In Stock</span>
              </button>

              <button
                onClick={() => setStatus(STATUS.LOW_STOCK)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all ${current.status === STATUS.LOW_STOCK ? 'bg-yellow-50 border-yellow-400' : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'}`}
              >
                <AlertTriangle size={20} className={current.status === STATUS.LOW_STOCK ? 'text-yellow-600' : 'text-gray-400'} />
                <span className={`text-xs font-medium ${current.status === STATUS.LOW_STOCK ? 'text-yellow-700' : 'text-gray-500'}`}>Low Stock</span>
              </button>

              <button
                onClick={() => setStatus(STATUS.OUT_OF_STOCK)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 transition-all ${current.status === STATUS.OUT_OF_STOCK ? 'bg-red-50 border-red-400' : 'border-gray-200 hover:border-red-300 hover:bg-red-50'}`}
              >
                <XCircle size={20} className={current.status === STATUS.OUT_OF_STOCK ? 'text-red-600' : 'text-gray-400'} />
                <span className={`text-xs font-medium ${current.status === STATUS.OUT_OF_STOCK ? 'text-red-700' : 'text-gray-500'}`}>Out of Stock</span>
              </button>
            </div>

            {/* Add note */}
            {showNotes ? (
              <div className="mt-3">
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-2 text-sm resize-none focus:outline-none focus:border-indigo-400"
                  rows={2}
                  placeholder="Add a note (e.g. need 2 bags)"
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />
                <div className="flex gap-2 mt-1">
                  <button onClick={saveNote} className="flex-1 bg-indigo-600 text-white text-xs py-1.5 rounded-lg">Save Note</button>
                  <button onClick={() => setShowNotes(false)} className="flex-1 border border-gray-200 text-xs py-1.5 rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setShowNotes(true); setNoteText(current.notes || '') }}
                className="mt-3 w-full text-xs text-gray-400 hover:text-indigo-500 transition-colors"
              >
                + Add note
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => go(-1)}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 py-3 rounded-2xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ChevronLeft size={18} /> Previous
        </button>
        <button
          onClick={() => go(1)}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-2xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>

      {/* Quick jump to category */}
      <div className="mt-4 text-center text-xs text-gray-400">
        Tip: Use filters to jump to a specific category or status
      </div>
    </div>
  )
}
