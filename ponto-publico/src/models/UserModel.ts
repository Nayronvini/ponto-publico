import { UserMongooseModel } from "../schemas/UserSchema"

const UserModel = {
  async create(dados: any) {
    return await UserMongooseModel.create(dados)
  },

  async findByEmail(email: string) {
    // O select('+senha_hash') é usado caso você configure o schema para não retornar senha por padrão
    // mas aqui vamos simplificar
    return await UserMongooseModel.findOne({ email })
  },

  async findById(id: string) {
    return await UserMongooseModel.findById(id).select("-senha_hash") // Nunca retorna o hash da senha
  },
  
  async update(id: string, dados: any) {
   return await UserMongooseModel.findByIdAndUpdate(id, dados, { new: true }).select("-senha_hash");
}
}

export default UserModel