import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    // Removemos o objeto interno e usamos .min para validar presença e tamanho
    nome: z.string({ message: "Nome é obrigatório" })
           .min(3, "Nome deve ter no mínimo 3 caracteres"),
    
    email: z.string({ message: "Email é obrigatório" })
            .email("Formato de e-mail inválido"),
    
    senha: z.string({ message: "Senha é obrigatória" })
            .min(6, "A senha deve ter no mínimo 6 caracteres")
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email é obrigatório" })
            .email("E-mail inválido"),
    senha: z.string({ message: "Senha é obrigatória" })
            .min(1, "A senha não pode ser vazia")
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    nome: z.string().min(3, "Nome muito curto").optional(),
    foto: z.string().optional()
  }),
});