import { FastifyRequest, FastifyReply } from "fastify";

export const me = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    return reply.send({ logged: true, user: request.user });
}