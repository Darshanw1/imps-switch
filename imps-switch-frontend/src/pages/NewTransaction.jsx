import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import PageHeader from '../components/PageHeader'
import StatusChip from '../components/StatusChip'
import useHistory from '../context/useHistory'
import { createTransaction, describeError } from '../services/impsService'
import { formatAmount } from '../utils/format'

const EMPTY_FORM = {
  senderBankCode: '',
  receiverBankCode: '',
  amount: '',
  transactionType: 'OUTWARD',
}

// Mirrors the rules in the Java TransactionRequest record.
function validate(form) {
  const errors = {}
  const sender = form.senderBankCode.trim()
  const receiver = form.receiverBankCode.trim()

  if (!sender) errors.senderBankCode = 'Sender bank code is required'
  else if (sender.length > 20) errors.senderBankCode = 'Maximum 20 characters'

  if (!receiver) errors.receiverBankCode = 'Receiver bank code is required'
  else if (receiver.length > 20) errors.receiverBankCode = 'Maximum 20 characters'

  const amount = Number(form.amount)
  if (form.amount === '' || Number.isNaN(amount)) errors.amount = 'Amount is required'
  else if (amount < 0.01) errors.amount = 'Amount must be at least 0.01'

  return errors
}

export default function NewTransaction() {
  const { addTransaction } = useHistory()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [requestError, setRequestError] = useState('')

  const handleChange = (field) => (event) => {
    const value =
      field.endsWith('BankCode') ? event.target.value.toUpperCase() : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setResult(null)
    setRequestError('')

    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const payload = {
      senderBankCode: form.senderBankCode.trim(),
      receiverBankCode: form.receiverBankCode.trim(),
      amount: Number(form.amount),
      transactionType: form.transactionType,
    }

    setSubmitting(true)
    try {
      const response = await createTransaction(payload)
      setResult(response)
      addTransaction({
        ...response,
        senderBankCode: payload.senderBankCode,
        receiverBankCode: payload.receiverBankCode,
        createdAt: new Date().toISOString(),
      })
      setForm(EMPTY_FORM)
    } catch (error) {
      setRequestError(describeError(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="New Transaction"
        subtitle="Send an IMPS transaction through the switch."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' },
          alignItems: 'start',
        }}
      >
        <Card>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: 'grid', gap: 2.5 }}
            >
              <TextField
                label="Sender bank code"
                value={form.senderBankCode}
                onChange={handleChange('senderBankCode')}
                error={Boolean(errors.senderBankCode)}
                helperText={errors.senderBankCode || 'For example SBIN'}
                fullWidth
              />
              <TextField
                label="Receiver bank code"
                value={form.receiverBankCode}
                onChange={handleChange('receiverBankCode')}
                error={Boolean(errors.receiverBankCode)}
                helperText={errors.receiverBankCode || 'For example HDFC'}
                fullWidth
              />
              <TextField
                label="Amount (INR)"
                type="number"
                value={form.amount}
                onChange={handleChange('amount')}
                error={Boolean(errors.amount)}
                helperText={errors.amount || 'Minimum 0.01'}
                slotProps={{ htmlInput: { min: 0.01, step: '0.01' } }}
                fullWidth
              />
              <TextField
                select
                label="Transaction type"
                value={form.transactionType}
                onChange={handleChange('transactionType')}
                fullWidth
              >
                <MenuItem value="OUTWARD">OUTWARD</MenuItem>
                <MenuItem value="INWARD">INWARD</MenuItem>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {submitting ? 'Sending...' : 'Send transaction'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gap: 2 }}>
          {requestError && <Alert severity="error">{requestError}</Alert>}

          {result && (
            <Card>
              <CardContent sx={{ display: 'grid', gap: 1.5 }}>
                <Alert severity={result.status === 'SUCCESS' ? 'success' : 'error'}>
                  {result.message}
                </Alert>
                <StatusChip status={result.status} />
                <Typography variant="body2" color="text.secondary">
                  Reference
                </Typography>
                <Typography
                  sx={{ fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all' }}
                >
                  {result.transactionReference}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.transactionType} &middot; {formatAmount(result.amount)}
                </Typography>
              </CardContent>
            </Card>
          )}

          {!result && !requestError && (
            <Typography color="text.secondary">
              The result of your transaction will appear here.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  )
}
