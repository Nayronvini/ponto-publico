import mongoose from "mongoose"

export async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log("✅ MongoDB conectado com sucesso")
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB", error)
    process.exit(1)
  }
}