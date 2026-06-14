import { STATUS, STATUS_COLORS, STATUS_LABELS } from '../data/ghanaianItems'

export default function Overview({ items, stats, onNavigateToCheck }) {
  const byCategory = {}
  items.forEach(item => {
    if (!byCategory[item.category]) byCategory[item.category] = []
    byCategory[item.category].push(item)
  })

  const lowAndOut = items.filter(
    i => i.status === STATUS.LOW_STOCK || i.status === STATUS.OUT_OF_STOCK
  )

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-500 mt-1">Total Items</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-100 text-center">
          <div className="text-3xl font-bold text-green-700">{stats.inStock}</div>
          <div className="text-sm text-green-600 mt-1">In Stock</div>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 shadow-sm border border-yellow-100 text-center">
          <div className="text-3xl font-bold text-yellow-700">{stats.lowStock}</div>
          <div className="text-sm text-yellow-600 mt-1">Running Low</div>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 shadow-sm border border-red-100 text-center">
          <div className="text-3xl font-bold text-red-700">{stats.outOfStock}</div>
          <div className="text-sm text-red-600 mt-1">Out of Stock</div>
        </div>
      </div>

      {/* Alert Banner */}
      {lowAndOut.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="font-semibold text-orange-800">
                🛒 {lowAndOut.length} item{lowAndOut.length > 1 ? 's' : ''} need restocking
              </div>
              <div className="text-sm text-orange-600 mt-1">
                {lowAndOut.slice(0, 4).map(i => i.name).join(', ')}
                {lowAndOut.length > 4 ? ` +${lowAndOut.length - 4} more` : ''}
              </div>
            </div>
            <button
              onClick={() => onNavigateToCheck('shopping')}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              View Shopping List
            </button>
          </div>
        </div>
      )}

      {/* By Category */}
      <h2 className="text-lg font-bold text-gray-800 mb-3">By Category</h2>
      <div className="space-y-3">
        {Object.entries(byCategory).map(([category, catItems]) => {
          const inStock = catItems.filter(i => i.status === STATUS.IN_STOCK).length
          const low = catItems.filter(i => i.status === STATUS.LOW_STOCK).length
          const out = catItems.filter(i => i.status === STATUS.OUT_OF_STOCK).length
          const pct = Math.round((inStock / catItems.length) * 100)

          return (
            <div key={category} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700 text-sm">{category}</span>
                <div className="flex gap-2 text-xs">
                  {low > 0 && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{low} low</span>}
                  {out > 0 && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{out} out</span>}
                  <span className="text-gray-400">{catItems.length} items</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">{pct}% in stock</div>

              {/* Items with issues */}
              {(low > 0 || out > 0) && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {catItems
                    .filter(i => i.status !== STATUS.IN_STOCK)
                    .map(item => {
                      const colors = STATUS_COLORS[item.status]
                      return (
                        <span
                          key={item.id}
                          className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                        >
                          {item.emoji} {item.name}
                        </span>
                      )
                    })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
