import { Router } from "express"
import AuthController from "../controllers/AuthController"
import { authMiddleware } from "../middlewares/authMiddleware"
import validate from "../middlewares/validateResource"
import { loginSchema, registerSchema, updateProfileSchema } from "../validators/authSchema"

const router = Router()

// --- Rotas Públicas (Com Validação Zod) ---
router.post("/register", validate(registerSchema), AuthController.registrar);
router.post("/login", validate(loginSchema), AuthController.login);

// --- Rotas Protegidas (Logadas) ---
router.put("/perfil", authMiddleware, validate(updateProfileSchema), AuthController.atualizarPerfil);

// --- Rotas Administrativas ---
router.get("/users", authMiddleware, AuthController.listarTodos)
router.delete("/users/:id", authMiddleware, AuthController.deletarUsuario)
router.put("/users/:id", authMiddleware, AuthController.editarUsuarioAdmin)

export default router