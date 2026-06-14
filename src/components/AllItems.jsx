import { useState } from 'react'
import { STATUS, STATUS_COLORS, STATUS_LABELS, CATEGORIES } from '../data/ghanaianItems'
import { Search, Plus, Trash2, ChevronDown } from 'lucide-react'

export default function AllItems({ items, updateStatus, addItem, deleteItem }) {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('🛒')
  const [newCategory, setNewCategory] = useState(CATEGORIES[0])
  const [expandedCats, setExpandedCats] = useState(new Set(CATEGORIES))

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'All' || item.category === filterCat
    const matchStatus = filterStatus === 'All' || item.status === filterStatus
    return matchSearch && matchCat && matchStatus
  })

  // Group by category
  const grouped = {}
  filtered.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  })

  function toggleCat(cat) {
    setExpandedCats(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  async function handleAdd() {
    if (!newName.trim()) return
    await addItem({ name: newName.trim(), emoji: newEmoji, category: newCategory })
    setNewName('')
    setNewEmoji('🛒')
    setShowAddForm(false)
  }

  async function handleDelete(item) {
    if (confirm(`Remove "${item.name}" from your inventory?`)) {
      await deleteItem(item.id)
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Search */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search all items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {['All', 'in_stock', 'low_stock', 'out_of_stock'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${filterStatus === s ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600'}`}
          >
            {s === 'All' ? 'All' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Add Item */}
      {showAddForm ? (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-4 mb-4">
          <div className="font-semibold text-gray-700 mb-3">Add New Item</div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Emoji"
              value={newEmoji}
              onChange={e => setNewEmoji(e.target.value)}
              className="w-14 border border-gray-200 rounded-xl p-2 text-center text-xl"
            />
            <input
              type="text"
              placeholder="Item name (e.g. Garden Eggs)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-400"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-2 text-sm mb-3 focus:outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-indigo-700">Add Item</button>
            <button onClick={() => setShowAddForm(false)} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-300 text-indigo-600 py-3 rounded-2xl text-sm font-medium hover:bg-indigo-50 transition-colors mb-4"
        >
          <Plus size={16} /> Add Custom Item
        </button>
      )}

      {/* Grouped list */}
      {Object.entries(grouped).length === 0 ? (
        <div className="text-center text-gray-400 py-8">No items found</div>
      ) : (
        Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat} className="mb-3">
            <button
              onClick={() => toggleCat(cat)}
              className="w-full flex items-center justify-between mb-1 px-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">{cat}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{catItems.length}</span>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${expandedCats.has(cat) ? '' : '-rotate-90'}`} />
            </button>

            {expandedCats.has(cat) && (
              <div className="space-y-1.5">
                {catItems.map(item => {
                  const colors = STATUS_COLORS[item.status]
                  return (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 px-3 py-2.5">
                      <span className="text-lg">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{item.name}</div>
                        {item.notes && <div className="text-xs text-gray-400 truncate">{item.notes}</div>}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <select
                          value={item.status}
                          onChange={e => updateStatus(item.id, e.target.value)}
                          className={`text-xs border rounded-lg px-1.5 py-1 ${colors.bg} ${colors.text} ${colors.border} focus:outline-none`}
                        >
                          <option value={STATUS.IN_STOCK}>In Stock</option>
                          <option value={STATUS.LOW_STOCK}>Low Stock</option>
                          <option value={STATUS.OUT_OF_STOCK}>Out of Stock</option>
                        </select>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
