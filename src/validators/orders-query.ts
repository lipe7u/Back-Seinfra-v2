import { z } from "zod";

const ordersqueryschema = z.object({
  message: z.string().min(1, "A mensagem é obrigatória"),
  id_order: z.coerce.number().int().positive().optional(),
})

export { ordersqueryschema };