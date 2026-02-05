import { Request, Response } from "express"
import AvaliacaoModel from "../models/AvaliacaoModel"
import { AuthRequest } from "../middlewares/authMiddleware"

const AvaliacaoController = {
  async criar(req: AuthRequest, res: Response) {
    try {
      const { pontoId, nota, comentario } = req.body
      const userId = req.userId // Vem do token (authMiddleware)

      if (!pontoId || !nota) {
        return res.status(400).json({ error: "Ponto e Nota são obrigatórios" })
      }

      const novaAvaliacao = await AvaliacaoModel.create({
        pontoId,
        userId,
        nota,
        comentario
      })

      return res.status(201).json(novaAvaliacao)

    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async listarPorPonto(req: Request, res: Response) {
    try {
        
      const pontoId = req.params.pontoId as string
      const avaliacoes = await AvaliacaoModel.listByPonto(pontoId)
      return res.json(avaliacoes)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },
  async listarMinhas(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId // Vem do Token
      const minhasAvaliacoes = await AvaliacaoModel.listByUser(userId!)
      return res.json(minhasAvaliacoes)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async atualizar(req: AuthRequest, res: Response) {
    try {
      // CORREÇÃO: Forçamos que 'id' é string
      const id = req.params.id as string 
      const { nota, comentario } = req.body
      
      const atualizada = await AvaliacaoModel.update(id, { nota, comentario })
      return res.json(atualizada)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async deletar(req: AuthRequest, res: Response) {
    try {
      // CORREÇÃO: Forçamos que 'id' é string aqui também
      const id = req.params.id as string
      
      await AvaliacaoModel.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }
}

export default AvaliacaoController