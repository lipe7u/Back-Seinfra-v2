import { z } from "zod";

const validationsMessages = {
  Endereco: {
    Required: "Endereço é obrigatório",
    Min: "Endereço deve ter pelo menos 5 caracteres",
    Max: "Endereço inválido"
  },
  PontoReferencia: {
    Max: "Ponto de referência muito longo (máximo 200 caracteres)"
  },
  Descricao: {
    Required: "Descrição é obrigatória",
    Min: "Descreva o ocorrido com pelo menos 10 caracteres",
    Max: "Descrição muito longa (máximo 1000 caracteres)"
  }
}


export const CreateRequestSchema = z.object({
  address: z.string()
    .min(1,validationsMessages.Endereco.Required)
    .min(5, validationsMessages.Endereco.Min)
    .max(300, validationsMessages.Endereco.Max),
  
    landmark: z.string()
    .optional(),
  
    description: z.string()
    .min(1, validationsMessages.Descricao.Required)
    .min(10,validationsMessages.Descricao.Min)
    .max(1000, validationsMessages.Descricao.Max),
});

export const idSchema = z.object({
  id: z.string().uuid(),
});
