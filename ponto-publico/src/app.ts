// src/app.ts
import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import pontoPublicoRoutes from "./routes/pontoPublicoRoutes"
import { connectMongo } from "./config/mongo"
import authRoutes from "./routes/authRoutes" // Importe a rota

const app = express()

connectMongo()

// Middlewares
app.use(cors())
// AUMENTEI O LIMITE AQUI (Para suportar as imagens Base64)
app.use(express.json({ limit: '50mb' })) 
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Rotas
app.use("/api/pontos", pontoPublicoRoutes)
app.use("/api/auth", authRoutes)

// Iniciar Servidor
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
  console.log(`Acesse: http://localhost:${PORT}/api/pontos`)
})

export default app