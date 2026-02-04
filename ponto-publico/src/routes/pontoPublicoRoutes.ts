// src/routes/PontoPublicoRoutes.ts
import { Router } from "express"
import PontoPublicoController from "../controllers/PontoPublicoController"

const router = Router()

// Definição das Rotas
router.get("/", PontoPublicoController.listar)       // Listar todos
router.post("/", PontoPublicoController.criar)       // Criar novo
router.put("/:id", PontoPublicoController.atualizar) // Atualizar pelo ID
router.delete("/:id", PontoPublicoController.deletar) // Deletar pelo ID

export default router
