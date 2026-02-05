import { z } from "zod";

export const pontoSchema = z.object({
  body: z.object({
    nome: z.string({ message: "Nome do local é obrigatório" })
           .min(3, "Nome muito curto"),

    descricao: z.string().optional(),
    
    // Para números, se você quiser validar que é obrigatório, 
    // o Zod padrão geralmente exige apenas z.number()
    latitude: z.number({ message: "Latitude é obrigatória e deve ser número" })
               .min(-90).max(90, "Latitude inválida"),
    
    longitude: z.number({ message: "Longitude é obrigatória e deve ser número" })
                .min(-180).max(180, "Longitude inválida"),

    endereco: z.string().optional(),
    horario_funcionamento: z.string().optional(),
    telefone: z.string().optional(),
  }),
});