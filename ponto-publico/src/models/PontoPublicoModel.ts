import { PontoPublicoMongooseModel } from "../schemas/PontoPublicoSchema"

const PontoPublicoModel = {
  async getAll() {
    return await PontoPublicoMongooseModel.find()
  },

  async create(ponto: any) {
    const latitude = Number(ponto.latitude)
    const longitude = Number(ponto.longitude)

    return await PontoPublicoMongooseModel.create({
      nome: ponto.nome,
      endereco: ponto.endereco,
      descricao: ponto.descricao,
      horario_funcionamento: ponto.horario_funcionamento,
      telefone: ponto.telefone,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    })
  },

  async update(id: string, dados: any) {
    const updatePayload: any = { ...dados }

    if (dados.latitude && dados.longitude) {
      updatePayload.location = {
        type: "Point",
        coordinates: [
          Number(dados.longitude),
          Number(dados.latitude)
        ]
      }
    }

    return await PontoPublicoMongooseModel.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    )
  },

  async delete(id: string) {
    await PontoPublicoMongooseModel.findByIdAndDelete(id)
    return true
  }
}

export default PontoPublicoModel