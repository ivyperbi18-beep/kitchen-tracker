import { STATUS } from '../data/ghanaianItems'
import { ShoppingCart, CheckCircle2, AlertTriangle, XCircle, BarChart3 } from 'lucide-react'

export default function Overview({ items, stats, onNavigateToCheck }) {
  const lowAndOut = items.filter(
    i => i.status === STATUS.LOW_STOCK || i.status === STATUS.OUT_OF_STOCK
  )

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-500 mt-1 font-medium">Total Items</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-100 text-center">
          <div className="text-4xl font-bold text-green-700">{stats.inStock}</div>
          <div className="text-sm text-green-600 mt-1 font-medium">In Stock</div>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 shadow-sm border border-yellow-100 text-center">
          <div className="text-4xl font-bold text-yellow-700">{stats.lowStock}</div>
          <div className="text-sm text-yellow-600 mt-1 font-medium">Running Low</div>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 shadow-sm border border-red-100 text-center">
          <div className="text-4xl font-bold text-red-700">{stats.outOfStock}</div>
          <div className="text-sm text-red-600 mt-1 font-medium">Out of Stock</div>
        </div>
      </div>

      {/* Alert Banner */}
      {lowAndOut.length > 0 ? (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5">
          <div className="font-semibold text-orange-800 text-base mb-1">
            🛒 {lowAndOut.length} item{lowAndOut.length > 1 ? 's' : ''} need restocking
          </div>
          <div className="text-sm text-orange-600 mb-3">
            {lowAndOut.slice(0, 3).map(i => i.name).join(', ')}
            {lowAndOut.length > 3 ? ` +${lowAndOut.length - 3} more` : ''}
          </div>
          <button
            onClick={() => onNavigateToCheck('shopping')}
            className="w-full bg-orange-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            View Shopping List
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-semibold text-green-700">All stocked up!</div>
          <div className="text-sm text-green-600 mt-1">Nothing needs restocking right now</div>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-base font-bold text-gray-700 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-3 mb-5">
        <button
          onClick={() => onNavigateToCheck('check')}
          className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm active:bg-gray-50"
        >
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={22} className="text-indigo-600" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-800">Check Stock</div>
            <div className="text-sm text-gray-400">Update item statuses one by one</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateToCheck('shopping')}
          className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm active:bg-gray-50"
        >
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={22} className="text-red-500" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-800">Shopping List</div>
            <div className="text-sm text-gray-400">{lowAndOut.length} item{lowAndOut.length !== 1 ? 's' : ''} to buy</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateToCheck('categories')}
          className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm active:bg-gray-50"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BarChart3 size={22} className="text-purple-600" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-800">By Category</div>
            <div className="text-sm text-gray-400">See stock levels per category</div>
          </div>
        </button>
      </div>

      {/* Low stock items list */}
      {lowAndOut.length > 0 && (
        <>
          <h2 className="text-base font-bold text-gray-700 mb-3">Needs Attention</h2>
          <div className="space-y-2">
            {lowAndOut.map(item => (
              <div key={item.id} className={`bg-white rounded-xl border shadow-sm flex items-center gap-3 px-4 py-3 ${item.status === STATUS.OUT_OF_STOCK ? 'border-red-200' : 'border-yellow-200'}`}>
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.category}</div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.status === STATUS.OUT_OF_STOCK ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status === STATUS.OUT_OF_STOCK ? 'Out' : 'Low'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
