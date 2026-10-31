import { Chip } from '@mui/material'

// Backend statuses: RECEIVED, ROUTED, SUBMITTED, SUCCESS, FAILED
const COLORS = {
  SUCCESS: 'success',
  FAILED: 'error',
  RECEIVED: 'default',
  ROUTED: 'info',
  SUBMITTED: 'warning',
  CALCULATED: 'secondary',
}

export default function StatusChip({ status }) {
  return (
    <Chip
      size="small"
      label={status}
      color={COLORS[status] || 'default'}
      variant={status === 'SUCCESS' || status === 'FAILED' ? 'filled' : 'outlined'}
    />
  )
}
