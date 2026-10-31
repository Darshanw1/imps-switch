import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PageHeader from '../components/PageHeader'
import StatusChip from '../components/StatusChip'
import useHistory from '../context/useHistory'
import { describeError, runSettlement } from '../services/impsService'
import { formatAmount, formatDateTime } from '../utils/format'

export default function Settlement() {
  const { settlements, addSettlement } = useHistory()
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  const latest = settlements[0]

  const handleRun = async () => {
    setError('')
    setRunning(true)
    try {
      const record = await runSettlement()
      addSettlement(record)
    } catch (err) {
      setError(describeError(err))
    } finally {
      setRunning(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Settlement"
        subtitle="Calculate the settlement summary for all successful transactions."
        action={
          <Button
            variant="contained"
            onClick={handleRun}
            disabled={running}
            startIcon={running ? <CircularProgress size={18} color="inherit" /> : <PlayArrowIcon />}
          >
            {running ? 'Running...' : 'Run settlement'}
          </Button>
        }
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        The backend adds up every SUCCESS transaction it currently holds in
        memory. If you restart the Spring Boot app, that memory is cleared.
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {latest && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Latest result
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Settlement reference
                </Typography>
                <Typography
                  sx={{ fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all' }}
                >
                  {latest.settlementReference}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Successful transactions
                </Typography>
                <Typography variant="h5">{latest.totalTransactions}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total amount
                </Typography>
                <Typography variant="h5">{formatAmount(latest.totalAmount)}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Settlement history
          </Typography>
          {settlements.length === 0 ? (
            <Typography color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
              No settlements run yet.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell align="right">Transactions</TableCell>
                    <TableCell align="right">Total amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {settlements.map((record) => (
                    <TableRow key={record.settlementReference} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {record.settlementReference}
                      </TableCell>
                      <TableCell align="right">{record.totalTransactions}</TableCell>
                      <TableCell align="right">{formatAmount(record.totalAmount)}</TableCell>
                      <TableCell>
                        <StatusChip status={record.status} />
                      </TableCell>
                      <TableCell>{formatDateTime(record.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </>
  )
}
