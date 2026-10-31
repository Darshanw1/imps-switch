import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import StatusChip from './StatusChip'
import { formatAmount, formatDateTime } from '../utils/format'

export default function TransactionTable({ rows, emptyText }) {
  if (rows.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
        {emptyText}
      </Typography>
    )
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Reference</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((tx) => (
            <TableRow key={tx.transactionReference} hover>
              <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                {tx.transactionReference}
              </TableCell>
              <TableCell>{tx.transactionType}</TableCell>
              <TableCell>{tx.senderBankCode}</TableCell>
              <TableCell>{tx.receiverBankCode}</TableCell>
              <TableCell align="right">{formatAmount(tx.amount)}</TableCell>
              <TableCell>
                <StatusChip status={tx.status} />
              </TableCell>
              <TableCell>{formatDateTime(tx.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
