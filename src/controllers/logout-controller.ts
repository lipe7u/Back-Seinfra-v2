import { FastifyRequest, FastifyReply } from "fastify";

export const logout = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    reply.clearCookie("token", {
        path: "/",
        domain: ".seinfra.com.br",
    });

    return reply.send({ success: true });
}