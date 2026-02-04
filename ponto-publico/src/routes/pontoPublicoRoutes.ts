// src/routes/PontoPublicoRoutes.ts
import { Router } from "express"
import PontoPublicoController from "../controllers/PontoPublicoController"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

// Definição das Rotas
router.get("/", PontoPublicoController.listar) // Listar todos
router.post("/", authMiddleware, PontoPublicoController.criar) // Criar novo (somente logado)
router.put("/:id", authMiddleware, PontoPublicoController.atualizar) // Atualizar pelo ID (somente logado)
router.delete("/:id", authMiddleware, PontoPublicoController.deletar) // Deletar pelo ID (somente logado)

export default router
