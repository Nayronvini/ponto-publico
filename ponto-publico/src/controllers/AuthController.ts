import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserModel from "../models/UserModel"
import { getNeoSession } from "../config/neo4j" // Importe a conexão

interface AuthRequest extends Request { userId?: string }

const AuthController = {
  async registrar(req: Request, res: Response) {
    // O Zod já validou se os campos existem, podemos ir direto pra lógica
    const { nome, email, senha } = req.body

    try {
      const usuarioExistente = await UserModel.findByEmail(email)
      if (usuarioExistente) {
        return res.status(400).json({ error: "Email já cadastrado" })
      }

      const salt = await bcrypt.genSalt(10)
      const senha_hash = await bcrypt.hash(senha, salt)

      const novoUsuario = await UserModel.create({ nome, email, senha_hash })

      const session = getNeoSession()
      try {
        await session.run(
          `CREATE (u:User { mongoId: $mongoId, nome: $nome })`,
          { 
            mongoId: novoUsuario._id.toString(), 
            nome: novoUsuario.nome 
          }
        )
      } catch (neoError) {
        console.error("Erro ao sincronizar Neo4j:", neoError)
      } finally {
        await session.close()
      }

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
      const usuario = await UserModel.findByEmail(email)

      if (!usuario) {
        return res.status(401).json({ error: "Credenciais inválidas" })
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)

      if (!senhaValida) {
        return res.status(401).json({ error: "Credenciais inválidas" })
      }

      const secret = process.env.JWT_SECRET || "secret"
      const token = jwt.sign(
        { id: usuario._id, email: usuario.email }, 
        secret, 
        { expiresIn: "1d" }
      )

      return res.json({
        token,
        user: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          foto: usuario.foto
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
      const userId = req.userId 

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
  },

  async listarTodos(req: Request, res: Response) {
    try {
      const usuarios = await UserModel.findAll()
      return res.json(usuarios)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async deletarUsuario(req: Request, res: Response) {
    try {
      const id = req.params.id as string 
        await UserModel.delete(id);
        return res.status(204).send();
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
  },
  
  async editarUsuarioAdmin(req: Request, res: Response) {
      try {
          const id = req.params.id as string 
          const { nome } = req.body;
          
          const atualizado = await UserModel.update(id, { nome });
          return res.json(atualizado);
      } catch (error: any) {
          return res.status(500).json({ error: error.message });
      }
  }
}


export default AuthController