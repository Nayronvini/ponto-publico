import { Router } from "express"
import AvaliacaoController from "../controllers/AvaliacaoController"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

// POST: Criar avaliação (Só logado)
router.post("/", authMiddleware, AvaliacaoController.criar)

// GET: Listar avaliações de um ponto específico
router.get("/:pontoId", AvaliacaoController.listarPorPonto)

// --- NOVAS ROTAS ---
// Rota para pegar "minhas" avaliações (o usuário vem do token)
router.get("/usuario/meus-reviews", authMiddleware, AvaliacaoController.listarMinhas)
// PUT: editar
// Rotas para editar/deletar pelo ID da Avaliação
router.put("/:id", authMiddleware, AvaliacaoController.atualizar)
// DELETE: deletar
router.delete("/:id", authMiddleware, AvaliacaoController.deletar)

export default router