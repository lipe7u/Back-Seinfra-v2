import { FastifyRequest, FastifyReply } from "fastify";
import { loginAdminService } from "../services/login-service"
import { LoginAdminB } from "../interface/auth-interfaces";

export const loginAdmin = async (
  request: FastifyRequest<{ Body: LoginAdminB }>,
  reply: FastifyReply
) => {
  try {
    const token = await loginAdminService(reply.server, request.body);
    reply.setCookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60,
      sameSite: "none",
      path: "/"
    }).send({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro no login";
    reply.code(401).send({ error: message });
  }
};