import { FastifyRequest, FastifyReply } from "fastify";
import { CreateRequestSchema } from "../validators/validations";
import { RequestInput } from "../interface/requests-interface";
import { RequestsService } from "../services/solicitacoes-service";
import { z } from "zod";


export const CreateRequests = async (
  request: FastifyRequest<{ Body: RequestInput }>,
  reply: FastifyReply
) => {
  try {
    const body = CreateRequestSchema.parse(request.body);
    const { id: userId } = request.user ;
    
    const result = await RequestsService.CreateRequest({
      body,
      userId
    })
    
    return reply.status(201).send(result);
          
    } catch (error) {
      const errorMessage = error instanceof z.ZodError
          ? error.format()
          : "Erro ao criar solicitação";
    
      return reply.status(400).send({ error: errorMessage });
  }
};

export const ListRequests  = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id: id_user } = request.user ;
    const requests = await RequestsService.ListRequests(id_user);
    return reply.send(requests)

  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Erro ao listar solicitaçôes"

    return reply.status(500).send({ error: errorMessage });
  }
};
