import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserModel from "../models/UserModel"
interface AuthRequest extends Request { userId?: string }

const AuthController = {
  async registrar(req: Request, res: Response) {
    const { nome, email, senha } = req.body

    if (!email || !senha || !nome) {
      return res.status(400).json({ error: "Preencha todos os campos" })
    }

    try {
      // Verifica se usuário já existe
      const usuarioExistente = await UserModel.findByEmail(email)
      if (usuarioExistente) {
        return res.status(400).json({ error: "Email já cadastrado" })
      }

      // Criptografa a senha
      const salt = await bcrypt.genSalt(10)
      const senha_hash = await bcrypt.hash(senha, salt)

      // Cria usuário
      const novoUsuario = await UserModel.create({ nome, email, senha_hash })

      // Retorna sucesso (sem mandar a senha de volta)
      return res.status(201).json({
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      })

    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async login(req: Request, res: Response) {
    const { email, senha } = req.body

    try {
      // Busca usuário
      const usuario = await UserModel.findByEmail(email)

      if (!usuario) {
        return res.status(401).json({ error: "Credenciais inválidas" })
      }

      // Compara a senha enviada com o hash no banco
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)

      if (!senhaValida) {
        return res.status(401).json({ error: "Credenciais inválidas" })
      }

      // Gera o Token JWT
      const secret = process.env.JWT_SECRET || "secret"
      const token = jwt.sign(
        { id: usuario._id, email: usuario.email }, 
        secret, 
        { expiresIn: "1d" } // Token expira em 1 dia
      )

      return res.json({
        token,
        user: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email
        }
      })

    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },
  // --- MÉTODO DE ATUALIZAR ---
  async atualizarPerfil(req: AuthRequest, res: Response) {
    try {
      const { nome, foto } = req.body
      const userId = req.userId // Vem do authMiddleware

      // Procura e atualiza (retornando o novo dado)
      const usuarioAtualizado = await UserModel.update(userId!, { nome, foto })

      if (!usuarioAtualizado) {
        return res.status(404).json({ error: "Usuário não encontrado" })
      }

      return res.json({
        id: usuarioAtualizado._id,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        foto: usuarioAtualizado.foto
      })

    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }
}


export default AuthController