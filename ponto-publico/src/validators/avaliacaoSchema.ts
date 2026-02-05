import { z } from "zod";

export const avaliacaoSchema = z.object({
  body: z.object({
    pontoId: z.string().length(24, "ID do ponto inválido"),
    
    nota: z.number({ message: "Nota é obrigatória" })
           .int()
           .min(1, "Nota mínima é 1")
           .max(5, "Nota máxima é 5"),
           
    comentario: z.string({ message: "Comentário é obrigatório" })
                 .min(3, "Comentário muito curto")
                 .max(500, "Comentário muito longo (max 500)")
  }),
});