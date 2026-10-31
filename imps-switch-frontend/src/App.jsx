import { Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import Dashboard from './pages/Dashboard'
import NewTransaction from './pages/NewTransaction'
import Transactions from './pages/Transactions'
import Settlement from './pages/Settlement'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/new" element={<NewTransaction />} />
        <Route path="/settlement" element={<Settlement />} />
      </Route>
    </Routes>
  )
}

export default App
