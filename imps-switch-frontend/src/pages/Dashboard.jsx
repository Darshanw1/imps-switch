import { Link as RouterLink } from 'react-router-dom'
import { Alert, Box, Button, Card, CardContent, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import StatusChip from '../components/StatusChip'
import TransactionTable from '../components/TransactionTable'
import useHistory from '../context/useHistory'
import { formatAmount, formatDateTime } from '../utils/format'

export default function Dashboard() {
  const { transactions, settlements } = useHistory()

  const successful = transactions.filter((tx) => tx.status === 'SUCCESS')
  const failed = transactions.filter((tx) => tx.status === 'FAILED')
  const successTotal = successful.reduce((sum, tx) => sum + Number(tx.amount), 0)
  const lastSettlement = settlements[0]

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of the transactions you have sent from this browser."
        action={
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            component={RouterLink}
            to="/transactions/new"
          >
            New transaction
          </Button>
        }
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        The backend has no &quot;list transactions&quot; endpoint yet, so these
        numbers come from transactions sent through this app in this browser.
      </Alert>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          mb: 3,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
        }}
      >
        <StatCard label="Total transactions" value={transactions.length} />
        <StatCard label="Successful" value={successful.length} color="success.main" />
        <StatCard label="Failed" value={failed.length} color="error.main" />
        <StatCard label="Successful amount" value={formatAmount(successTotal)} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          alignItems: 'start',
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent transactions
            </Typography>
            <TransactionTable
              rows={transactions.slice(0, 5)}
              emptyText="No transactions yet. Send your first one."
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Last settlement
            </Typography>
            {lastSettlement ? (
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Typography
                  sx={{ fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}
                >
                  {lastSettlement.settlementReference}
                </Typography>
                <StatusChip status={lastSettlement.status} />
                <Typography>
                  {lastSettlement.totalTransactions} transactions
                </Typography>
                <Typography variant="h6">
                  {formatAmount(lastSettlement.totalAmount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDateTime(lastSettlement.createdAt)}
                </Typography>
              </Box>
            ) : (
              <Typography color="text.secondary">
                No settlement run yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
