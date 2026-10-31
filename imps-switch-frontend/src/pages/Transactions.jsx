import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import PageHeader from '../components/PageHeader'
import TransactionTable from '../components/TransactionTable'
import useHistory from '../context/useHistory'

export default function Transactions() {
  const { transactions, clearTransactions } = useHistory()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [type, setType] = useState('ALL')

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return transactions.filter((tx) => {
      if (status !== 'ALL' && tx.status !== status) return false
      if (type !== 'ALL' && tx.transactionType !== type) return false
      if (!term) return true
      return [tx.transactionReference, tx.senderBankCode, tx.receiverBankCode]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
  }, [transactions, search, status, type])

  const handleClear = () => {
    if (window.confirm('Clear the transaction history saved in this browser?')) {
      clearTransactions()
    }
  }

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="Transactions sent from this browser. The backend keeps them in memory only."
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<DeleteIcon />}
              onClick={handleClear}
              disabled={transactions.length === 0}
            >
              Clear history
            </Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              component={RouterLink}
              to="/transactions/new"
            >
              New transaction
            </Button>
          </Box>
        }
      />

      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              mb: 2,
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
            }}
          >
            <TextField
              size="small"
              label="Search reference or bank code"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <TextField
              select
              size="small"
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <MenuItem value="ALL">All statuses</MenuItem>
              <MenuItem value="SUCCESS">SUCCESS</MenuItem>
              <MenuItem value="FAILED">FAILED</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <MenuItem value="ALL">All types</MenuItem>
              <MenuItem value="OUTWARD">OUTWARD</MenuItem>
              <MenuItem value="INWARD">INWARD</MenuItem>
            </TextField>
          </Box>

          <TransactionTable
            rows={rows}
            emptyText={
              transactions.length === 0
                ? 'No transactions yet.'
                : 'No transactions match your filters.'
            }
          />
        </CardContent>
      </Card>
    </>
  )
}
