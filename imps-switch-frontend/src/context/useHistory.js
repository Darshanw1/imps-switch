import { useContext } from 'react'
import HistoryContext from './HistoryContext'

export default function useHistory() {
  const value = useContext(HistoryContext)
  if (!value) {
    throw new Error('useHistory must be used inside <HistoryProvider>')
  }
  return value
}
