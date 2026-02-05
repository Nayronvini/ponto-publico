import { Request, Response } from "express"
import PontoPublicoModel from "../models/PontoPublicoModel"
import { AvaliacaoMongooseModel } from "../schemas/AvaliacaoSchema" // <--- Importante: Importe o Schema de Avaliação

const PontoPublicoController = {
  async listar(req: Request, res: Response) {
    try {
      const pontos = await PontoPublicoModel.getAll()

      // Usamos Promise.all para processar o cálculo da média de cada ponto
      const pontosFormatados = await Promise.all(pontos.map(async (p: any) => {
        
        // Busca todas as avaliações deste ponto específico
        const avaliacoes = await AvaliacaoMongooseModel.find({ pontoId: p._id })
        
        // Calcula a média matemática
        let media = 0
        if (avaliacoes.length > 0) {
          const soma = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0)
          media = soma / avaliacoes.length
        }

        return {
          id: p._id,
          nome: p.nome,
          endereco: p.endereco,
          descricao: p.descricao,
          horario_funcionamento: p.horario_funcionamento,
          telefone: p.telefone,
          latitude: p.location.coordinates[1],
          longitude: p.location.coordinates[0],
          media_avaliacao: media // <--- AGORA ENVIAMOS A MÉDIA
        }
      }))

      return res.json(pontosFormatados)

    } catch (error: any) {
      console.error(error) // Debug no terminal
      return res.status(500).json({ error: "Erro ao listar pontos" })
    }
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