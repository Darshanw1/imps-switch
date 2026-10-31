import { useEffect, useMemo, useState } from 'react'
import HistoryContext from './HistoryContext'

const TX_KEY = 'imps-switch:transactions'
const SETTLEMENT_KEY = 'imps-switch:settlements'

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be full or blocked. The app still works without it.
  }
}

// The backend has no "list transactions" endpoint yet, so this app
// remembers what you send from this browser (in localStorage).
export default function HistoryProvider({ children }) {
  const [transactions, setTransactions] = useState(() => load(TX_KEY))
  const [settlements, setSettlements] = useState(() => load(SETTLEMENT_KEY))

  useEffect(() => save(TX_KEY, transactions), [transactions])
  useEffect(() => save(SETTLEMENT_KEY, settlements), [settlements])

  const value = useMemo(
    () => ({
      transactions,
      settlements,
      addTransaction: (tx) => setTransactions((list) => [tx, ...list]),
      addSettlement: (record) => setSettlements((list) => [record, ...list]),
      clearTransactions: () => setTransactions([]),
      clearSettlements: () => setSettlements([]),
    }),
    [transactions, settlements],
  )

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  )
}
