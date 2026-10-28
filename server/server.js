import express from 'express'
import cors from 'cors'
import contact from './routes/contact.js'
const app = express()
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '10kb' }))
app.get('/api/health', (_, res) => res.json({ ok: true }))
app.use('/api/contact', contact)
app.use((_, res) => res.status(404).json({ ok: false, error: 'Not found' }))
app.listen(process.env.PORT || 5000, () => console.log('API ready'))
