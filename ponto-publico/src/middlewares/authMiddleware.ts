import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

// Interface para adicionar o userId na requisição
export interface AuthRequest extends Request {
  userId?: string
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" })
  }

  // O formato é "Bearer <token>", então separamos o espaço
  const parts = authorization.split(" ")
  if (parts.length !== 2) {
    return res.status(401).json({ error: "Erro no Token" })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token mal formatado" })
  }

  try {
    const secret = process.env.JWT_SECRET || "secret"
    const decoded = jwt.verify(token, secret) as { id: string }

    // Salva o ID do usuário na requisição para usar no controller se precisar
    req.userId = decoded.id

    return next()
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" })
  }
}