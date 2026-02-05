import { Router } from "express"
import AuthController from "../controllers/AuthController"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

router.post("/register", AuthController.registrar)
router.post("/login", AuthController.login)
router.put("/perfil", authMiddleware, AuthController.atualizarPerfil)

export default router