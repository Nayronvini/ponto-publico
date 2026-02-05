import { Schema, model, Document } from "mongoose"

export interface IPontoPublico extends Document {
  nome: string
  endereco?: string
  descricao?: string
  horario_funcionamento?: string
  telefone?: string
  location: {
    type: "Point"
    coordinates: number[]
  }
  createdAt: Date
}

const PontoPublicoSchema = new Schema<IPontoPublico>(
  {
    nome: {
      type: String,
      required: true
    },
    endereco: String,
    descricao: String,
    horario_funcionamento: String,
    telefone: String,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  { timestamps: true }
)

//Indice geoespacial
PontoPublicoSchema.index({ location: "2dsphere" })

export const PontoPublicoMongooseModel = model<IPontoPublico>(
  "PontoPublico",
  PontoPublicoSchema
)