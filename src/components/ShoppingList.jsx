import { useState } from 'react'
import { STATUS, STATUS_COLORS } from '../data/ghanaianItems'
import { CheckCircle2, Share2, Copy, Printer } from 'lucide-react'

export default function ShoppingList({ shoppingList, updateStatus }) {
  const [copied, setCopied] = useState(false)
  const [checkedOff, setCheckedOff] = useState(new Set())

  const outItems = shoppingList.filter(i => i.status === STATUS.OUT_OF_STOCK)
  const lowItems = shoppingList.filter(i => i.status === STATUS.LOW_STOCK)

  async function markRestocked(item) {
    await updateStatus(item.id, STATUS.IN_STOCK)
  }

  function toggleCheck(id) {
    setCheckedOff(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function buildText() {
    let text = '🛒 Shopping List\n\n'
    if (outItems.length > 0) {
      text += '❌ Need to Buy:\n'
      outItems.forEach(i => { text += `• ${i.emoji} ${i.name}${i.notes ? ` (${i.notes})` : ''}\n` })
      text += '\n'
    }
    if (lowItems.length > 0) {
      text += '⚠️ Running Low:\n'
      lowItems.forEach(i => { text += `• ${i.emoji} ${i.name}${i.notes ? ` (${i.notes})` : ''}\n` })
    }
    return text
  }

  async function copyList() {
    try {
      await navigator.clipboard.writeText(buildText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert(buildText())
    }
  }

  async function shareList() {
    const text = buildText()
    if (navigator.share) {
      await navigator.share({ title: 'Shopping List', text })
    } else {
      copyList()
    }
  }

  if (shoppingList.length === 0) {
    return (
      <div className="p-4 max-w-lg mx-auto text-center">
        <div className="mt-16 mb-4 text-6xl">🎉</div>
        <div className="text-xl font-bold text-gray-700">All stocked up!</div>
        <div className="text-gray-400 mt-2">Nothing on the shopping list right now.</div>
        <div className="text-sm text-gray-400 mt-4">
          Mark items as Low Stock or Out of Stock in the Check Stock tab to add them here.
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-400">{shoppingList.length} item{shoppingList.length > 1 ? 's' : ''} to get</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyList}
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-sm px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            {copied ? <CheckCircle2 size={15} className="text-green-500" /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={shareList}
            className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm px-3 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Share2 size={15} /> Share
          </button>
        </div>
      </div>

      {/* Out of Stock */}
      {outItems.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-sm font-semibold text-gray-700">Need to Buy ({outItems.length})</span>
          </div>
          <div className="space-y-2">
            {outItems.map(item => (
              <ShoppingItem
                key={item.id}
                item={item}
                checked={checkedOff.has(item.id)}
                onToggle={() => toggleCheck(item.id)}
                onRestocked={() => markRestocked(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Low Stock */}
      {lowItems.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">Running Low ({lowItems.length})</span>
          </div>
          <div className="space-y-2">
            {lowItems.map(item => (
              <ShoppingItem
                key={item.id}
                item={item}
                checked={checkedOff.has(item.id)}
                onToggle={() => toggleCheck(item.id)}
                onRestocked={() => markRestocked(item)}
              />
            ))}
          </div>
        </div>
      )}

      {checkedOff.size > 0 && (
        <div className="mt-4 text-center text-sm text-gray-400">
          {checkedOff.size} item{checkedOff.size > 1 ? 's' : ''} checked — tap "Mark Restocked" to remove from list
        </div>
      )}
    </div>
  )
}

function ShoppingItem({ item, checked, onToggle, onRestocked }) {
  const colors = STATUS_COLORS[item.status]
  return (
    <div className={`bg-white rounded-2xl border ${colors.border} shadow-sm overflow-hidden`}>
      <div className="flex items-center gap-3 p-3">
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}
        >
          {checked && <CheckCircle2 size={14} className="text-white" />}
        </button>

        <span className="text-xl">{item.emoji}</span>

        <div className="flex-1 min-w-0">
          <div className={`font-medium text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {item.name}
          </div>
          {item.notes && <div className="text-xs text-gray-400 truncate">{item.notes}</div>}
          <div className="text-xs text-gray-400">{item.category}</div>
        </div>

        <button
          onClick={onRestocked}
          className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors flex-shrink-0"
        >
          ✓ Restocked
        </button>
      </div>
    </div>
  )
}
