const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
})

export function formatAmount(value) {
  return currency.format(Number(value) || 0)
}

export function formatDateTime(isoString) {
  if (!isoString) return '-'
  return new Date(isoString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
