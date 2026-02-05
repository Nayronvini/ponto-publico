import { Schema, model, Document, Types } from "mongoose"

export interface IAvaliacao extends Document {
  pontoId: Types.ObjectId
  userId: Types.ObjectId
  nota: number // 1 a 5
  comentario: string
  createdAt: Date
}

const AvaliacaoSchema = new Schema<IAvaliacao>(
  {
    pontoId: { type: Schema.Types.ObjectId, ref: "PontoPublico", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    nota: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String, required: true }
  },
  { timestamps: true }
)

export const AvaliacaoMongooseModel = model<IAvaliacao>("Avaliacao", AvaliacaoSchema)