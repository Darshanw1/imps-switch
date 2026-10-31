import axios from 'axios'

// Every request goes to /api/v1/... The Vite proxy (vite.config.js)
// forwards it to your Spring Boot backend.
const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

export default api
