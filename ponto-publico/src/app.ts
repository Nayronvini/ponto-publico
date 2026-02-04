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
app.use(express.json())

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