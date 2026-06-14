import { useState } from 'react'
import { useInventory } from './hooks/useInventory'
import Overview from './components/Overview'
import StockChecker from './components/StockChecker'
import ShoppingList from './components/ShoppingList'
import AllItems from './components/AllItems'
import Categories from './components/Categories'
import { LayoutDashboard, ClipboardCheck, ShoppingCart, List, BarChart3 } from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Home', icon: LayoutDashboard },
  { id: 'check', label: 'Check', icon: ClipboardCheck },
  { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
  { id: 'categories', label: 'Categories', icon: BarChart3 },
  { id: 'all', label: 'All Items', icon: List },
]

export default function App() {
  const [tab, setTab] = useState('overview')
  const { items, loading, updateStatus, updateNotes, addItem, deleteItem, shoppingList, stats } = useInventory()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-5xl animate-bounce">🍲</div>
        <div className="text-lg font-semibold text-indigo-700">Setting up your kitchen...</div>
        <div className="text-sm text-gray-400">Loading your Ghanaian pantry</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="px-4 pt-3 pb-0">
          <div className="flex items-center gap-3 pb-2">
            <span className="text-2xl">🍲</span>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-none">My Kitchen</h1>
              <p className="text-xs text-gray-400">Pantry & Shopping Tracker</p>
            </div>
            {shoppingList.length > 0 && (
              <button
                onClick={() => setTab('shopping')}
                className="ml-auto flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-3 py-2 rounded-xl"
              >
                <ShoppingCart size={15} />
                {shoppingList.length} to buy
              </button>
            )}
          </div>

          {/* Tabs — scrollable on small screens */}
          <div className="flex border-t border-gray-100 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 min-w-[64px] flex flex-col items-center gap-1 px-2 py-3 text-xs font-bold transition-colors relative ${
                  tab === id ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                <Icon size={26} />
                <span className="whitespace-nowrap text-[11px]">{label}</span>
                {tab === id && (
                  <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-indigo-600 rounded-full" />
                )}
                {id === 'shopping' && shoppingList.length > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {shoppingList.length > 9 ? '9+' : shoppingList.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-8">
        {tab === 'overview' && (
          <Overview items={items} stats={stats} onNavigateToCheck={setTab} />
        )}
        {tab === 'check' && (
          <StockChecker items={items} updateStatus={updateStatus} updateNotes={updateNotes} />
        )}
        {tab === 'shopping' && (
          <ShoppingList shoppingList={shoppingList} updateStatus={updateStatus} />
        )}
        {tab === 'categories' && (
          <Categories items={items} />
        )}
        {tab === 'all' && (
          <AllItems items={items} updateStatus={updateStatus} addItem={addItem} deleteItem={deleteItem} />
        )}
      </main>
    </div>
  )
}
