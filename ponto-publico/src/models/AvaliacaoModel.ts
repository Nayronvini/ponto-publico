import { AvaliacaoMongooseModel } from "../schemas/AvaliacaoSchema"

const AvaliacaoModel = {
  async create(dados: any) {
    return await AvaliacaoMongooseModel.create(dados)
  },

  async listByPonto(pontoId: string) {
    // Isso diz ao Mongo Pegue o ID do usuário e me traga o nome e a foto dele
    return await AvaliacaoMongooseModel.find({ pontoId })
      .populate("userId", "nome foto") 
      .sort({ createdAt: -1 }) 
  },
  async listByUser(userId: string) {
    // Traz as avaliações desse usuário e PREENCHE o nome do Ponto
    return await AvaliacaoMongooseModel.find({ userId })
      .populate("pontoId", "nome") 
      .sort({ createdAt: -1 })
  },

  async update(id: string, dados: any) {
    return await AvaliacaoMongooseModel.findByIdAndUpdate(id, dados, { new: true })
  },

  async delete(id: string) {
    await AvaliacaoMongooseModel.findByIdAndDelete(id)
    return true
  }
}


export default AvaliacaoModel