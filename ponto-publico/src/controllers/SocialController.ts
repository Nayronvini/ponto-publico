import { Request, Response } from "express"
import { getNeoSession } from "../config/neo4j"
import { AuthRequest } from "../middlewares/authMiddleware"
import UserModel from "../models/UserModel" // <--- ADICIONE ESTA LINHA

const SocialController = {
  // Usuário A (Logado) segue Usuário B (Pelo ID)
  async seguirUsuario(req: AuthRequest, res: Response) {
    const meuId = req.userId // Quem está seguindo
    const idParaSeguir = req.params.id // Quem será seguido

    if (meuId === idParaSeguir) return res.status(400).json({ error: "Não pode seguir a si mesmo" })

    const session = getNeoSession()
    try {
      // Query Cypher: Encontra os dois nós pelo mongoId e cria uma relação [:SEGUE]
      const result = await session.run(
        `
        MATCH (a:User {mongoId: $meuId})
        MATCH (b:User {mongoId: $outroId})
        MERGE (a)-[r:SEGUE]->(b)
        RETURN r
        `,
        { meuId, outroId: idParaSeguir }
      )

      if (result.summary.counters.updates().relationshipsCreated === 0) {
        return res.json({ message: "Você já segue este usuário" })
      }

      return res.json({ message: "Seguindo com sucesso!" })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    } finally {
      await session.close()
    }
  },

  // Recomendação: "Amigos dos amigos que eu ainda não sigo"
  async recomendacoes(req: AuthRequest, res: Response) {
    const meuId = req.userId
    const session = getNeoSession()

    try {
      // A mágica do Grafo: Pega quem meus amigos seguem, que eu não sigo
      const result = await session.run(
        `
        MATCH (eu:User {mongoId: $meuId})-[:SEGUE]->(amigo)-[:SEGUE]->(fofoca)
        WHERE NOT (eu)-[:SEGUE]->(fofoca) AND eu <> fofoca
        RETURN fofoca.nome as nome, fofoca.mongoId as id, count(*) as conexoesEmComum
        ORDER BY conexoesEmComum DESC
        LIMIT 5
        `,
        { meuId }
      )

      const recomendados = result.records.map(record => ({
        nome: record.get("nome"),
        id: record.get("id"),
        motivo: `${record.get("conexoesEmComum")} amigos em comum`
      }))

      return res.json(recomendados)
    } finally {
      await session.close()
    }
  },
  // Adicione este método no SocialController
async sincronizarTudo(req: Request, res: Response) {
    const session = getNeoSession()
    try {
        // Pega todos do Mongo
        const usuariosMongo = await UserModel.findAll(); // Método que criamos antes
        
        for (const u of usuariosMongo) {
            // Cria nó no Neo4j se não existir (MERGE)
            await session.run(
                `MERGE (u:User { mongoId: $id }) ON CREATE SET u.nome = $nome`,
                { id: String(u._id), nome: u.nome }
            );
        }
        return res.json({ message: "Sincronização concluída!" });
    } catch(e) {
        return res.status(500).json({ error: (e as any).message });
    } finally {
        await session.close();
    }
}
}

export default SocialController