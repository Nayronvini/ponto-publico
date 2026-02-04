import { Request, Response } from "express"
import PontoPublicoModel from "../models/PontoPublicoModel"

const PontoPublicoController = {
    async listar(req: Request, res: Response) {
      const pontos = await PontoPublicoModel.getAll()

      const pontosFormatados = pontos.map((p: any) => ({
        id: p._id,
        nome: p.nome,
        endereco: p.endereco,
        descricao: p.descricao,
        horario_funcionamento: p.horario_funcionamento,
        telefone: p.telefone,
        latitude: p.location.coordinates[1],
        longitude: p.location.coordinates[0]
    }))

  return res.json(pontosFormatados)
},

  async criar(req: Request, res: Response) {
    try {
      const {
        nome,
        endereco,
        latitude,
        longitude,
        descricao,
        horario_funcionamento,
        telefone
      } = req.body

      if (!nome || !latitude || !longitude) {
        return res.status(400).json({
          error: "Nome, Latitude e Longitude são obrigatórios."
        })
      }

      const novoPonto = await PontoPublicoModel.create({
        nome,
        endereco,
        latitude,
        longitude,
        descricao,
        horario_funcionamento,
        telefone
      })

      return res.status(201).json(novoPonto)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const id = String(req.params.id)
      const atualizado = await PontoPublicoModel.update(id, req.body)
      return res.status(200).json(atualizado)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const id = String(req.params.id)
      await PontoPublicoModel.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }
}

export default PontoPublicoController


