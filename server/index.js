import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import authRouter from './routes/auth.js'
import resumeRouter from './routes/resume.js'
import templateRouter, { initTemplates } from './routes/template.js'
import { initDB } from './db/init.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(join(__dirname, 'uploads')))
app.use('/templates', express.static(join(__dirname, 'public/templates')))

initDB()
initTemplates()

app.use('/api/auth', authRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/templates', templateRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
