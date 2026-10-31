import api from './api'

// POST /api/v1/transactions
// payload: { senderBankCode, receiverBankCode, amount, transactionType }
export async function createTransaction(payload) {
  const response = await api.post('/transactions', payload)
  return response.data
}

// POST /api/v1/reconciliation/settlement
export async function runSettlement() {
  const response = await api.post('/reconciliation/settlement')
  return response.data
}

// Turns an axios error into a short message a person can understand.
export function describeError(error) {
  if (error.response) {
    if (error.response.status === 400) {
      return 'The backend rejected this request. Check the bank codes, the amount and the transaction type.'
    }
    return `The backend returned an error (HTTP ${error.response.status}).`
  }
  return 'Cannot reach the backend. Make sure the Spring Boot app is running and the proxy port in vite.config.js is correct.'
}
