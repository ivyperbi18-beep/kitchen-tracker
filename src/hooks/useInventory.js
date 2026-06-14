import { useState, useEffect } from 'react'
import {
  collection, doc, setDoc, onSnapshot, writeBatch, getDocs, deleteDoc
} from 'firebase/firestore'
import { db } from '../firebase'
import { DEFAULT_ITEMS, STATUS } from '../data/ghanaianItems'

const COLLECTION = 'inventory'

export function useInventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLLECTION), (snap) => {
      if (snap.empty && !initialized) {
        seedDefaults()
      } else {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        data.sort((a, b) => a.name.localeCompare(b.name))
        setItems(data)
        setLoading(false)
        setInitialized(true)
      }
    })
    return () => unsub()
  }, [])

  async function seedDefaults() {
    const batch = writeBatch(db)
    DEFAULT_ITEMS.forEach((item) => {
      const id = item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
      const ref = doc(db, COLLECTION, id)
      batch.set(ref, {
        ...item,
        status: STATUS.IN_STOCK,
        notes: '',
        updatedAt: new Date().toISOString(),
      })
    })
    await batch.commit()
    setInitialized(true)
  }

  async function updateStatus(id, status) {
    await setDoc(doc(db, COLLECTION, id), {
      status,
      updatedAt: new Date().toISOString(),
    }, { merge: true })
  }

  async function updateNotes(id, notes) {
    await setDoc(doc(db, COLLECTION, id), {
      notes,
      updatedAt: new Date().toISOString(),
    }, { merge: true })
  }

  async function addItem(item) {
    const id = item.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now()
    await setDoc(doc(db, COLLECTION, id), {
      ...item,
      status: STATUS.IN_STOCK,
      notes: '',
      updatedAt: new Date().toISOString(),
    })
    return id
  }

  async function deleteItem(id) {
    await deleteDoc(doc(db, COLLECTION, id))
  }

  const shoppingList = items.filter(
    i => i.status === STATUS.LOW_STOCK || i.status === STATUS.OUT_OF_STOCK
  )

  const stats = {
    total: items.length,
    inStock: items.filter(i => i.status === STATUS.IN_STOCK).length,
    lowStock: items.filter(i => i.status === STATUS.LOW_STOCK).length,
    outOfStock: items.filter(i => i.status === STATUS.OUT_OF_STOCK).length,
  }

  return { items, loading, updateStatus, updateNotes, addItem, deleteItem, shoppingList, stats }
}
