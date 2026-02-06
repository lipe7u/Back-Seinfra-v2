import { z } from "zod";

const validationsMessages = {
  Address: {
    Required: "Endereço é obrigatório",
    Min: "Endereço deve ter pelo menos 5 caracteres",
    Max: "Endereço inválido"
  },
  Reference: {
    Max: "Ponto de referência muito longo (máximo 200 caracteres)"
  },
  Description: {
    Required: "Descrição é obrigatória",
    Min: "Descreva o ocorrido com pelo menos 10 caracteres",
    Max: "Descrição muito longa (máximo 1000 caracteres)"
  }
}


export const CreateRequestSchema = z.object({
  address: z.string()
    .min(1,validationsMessages.Address.Required)
    .min(5, validationsMessages.Address.Min)
    .max(300, validationsMessages.Address.Max),
  
    reference: z.string()
    .optional(),
  
    description: z.string()
    .min(1, validationsMessages.Description.Required)
    .min(10,validationsMessages.Description.Min)
    .max(1000, validationsMessages.Description.Max),
});

export const idSchema = z.object({
  id: z.string().uuid(),
});
