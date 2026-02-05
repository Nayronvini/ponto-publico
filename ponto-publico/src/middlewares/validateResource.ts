import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

const validate = (schema: ZodSchema<any>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    // Verifica se é um erro do Zod
    if (error instanceof ZodError) {
      // CORREÇÃO: Usamos .issues (que é o padrão oficial)
      // Adicionamos '|| []' para garantir que nunca seja undefined
      const issues = (error as any).issues || [];

      return res.status(400).json({
        error: "Erro de Validação",
        details: issues.map((e: any) => ({
          // Tenta pegar o nome do campo de forma segura
          campo: e.path && e.path.length > 0 ? (e.path[1] || e.path[0]) : "Desconhecido",
          mensagem: e.message
        }))
      });
    }
    
    // Se não for ZodError, loga no terminal para você ver o que é
    console.error("Erro desconhecido na validação:", error);
    return res.status(500).json({ error: "Erro interno na validação" });
  }
};

export default validate;