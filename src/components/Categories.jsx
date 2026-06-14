import { STATUS, STATUS_COLORS } from '../data/ghanaianItems'

export default function Categories({ items }) {
  const byCategory = {}
  items.forEach(item => {
    if (!byCategory[item.category]) byCategory[item.category] = []
    byCategory[item.category].push(item)
  })

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">By Category</h2>
        <p className="text-sm text-gray-400">Stock levels across all your food groups</p>
      </div>

      <div className="space-y-3">
        {Object.entries(byCategory).map(([category, catItems]) => {
          const inStock = catItems.filter(i => i.status === STATUS.IN_STOCK).length
          const low = catItems.filter(i => i.status === STATUS.LOW_STOCK).length
          const out = catItems.filter(i => i.status === STATUS.OUT_OF_STOCK).length
          const pct = Math.round((inStock / catItems.length) * 100)

          return (
            <div key={category} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <span className="font-semibold text-gray-800 text-sm leading-snug flex-1 pr-2">{category}</span>
                <div className="flex gap-1.5 flex-shrink-0">
                  {low > 0 && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {low} low
                    </span>
                  )}
                  {out > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {out} out
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{pct}% in stock</span>
                <span>{catItems.length} items total</span>
              </div>

              {/* Items with issues */}
              {(low > 0 || out > 0) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {catItems
                    .filter(i => i.status !== STATUS.IN_STOCK)
                    .map(item => {
                      const colors = STATUS_COLORS[item.status]
                      return (
                        <span
                          key={item.id}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors.bg} ${colors.text}`}
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
