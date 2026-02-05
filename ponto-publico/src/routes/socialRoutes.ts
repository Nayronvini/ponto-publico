import { Router } from "express"
import SocialController from "../controllers/SocialController"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

// --- ROTA DE MIGRAÇÃO (Temporária) ---
// Deixei sem 'authMiddleware' para você rodar fácil no navegador
router.get("/sincronizar", SocialController.sincronizarTudo)

router.post("/seguir/:id", authMiddleware, SocialController.seguirUsuario)
router.get("/recomendacoes", authMiddleware, SocialController.recomendacoes)

export default router