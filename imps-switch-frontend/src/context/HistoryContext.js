import { createContext } from 'react'

// Holds the transaction and settlement history shared by all pages.
const HistoryContext = createContext(null)

export default HistoryContext
