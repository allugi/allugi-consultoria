import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(join(__dirname, '../../src')))

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../../src/formulario-allugi.html'))
})

app.get('/resultado', (req, res) => {
  res.sendFile(join(__dirname, '../../src/resultado-formulario.html'))
})

app.get('/pagamento', (req, res) => {
  res.sendFile(join(__dirname, '../../src/pagamento.html'))
})

app.get('/obrigado', (req, res) => {
  res.sendFile(join(__dirname, '../../src/obrigado.html'))
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
})
