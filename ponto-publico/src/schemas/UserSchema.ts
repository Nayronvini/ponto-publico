import { Schema, model, Document } from "mongoose"

export interface IUser extends Document {
  nome: string
  email: string
  senha_hash: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha_hash: { type: String, required: true },
  },
  { timestamps: true }
)

export const UserMongooseModel = model<IUser>("User", UserSchema)