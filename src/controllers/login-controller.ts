import { FastifyRequest, FastifyReply } from "fastify";
import { loginUserService } from "../services/login-service";
import { LoginB } from "../interface/auth-interfaces";

export const login = async (
  request: FastifyRequest<{ Body: LoginB }>,
  reply: FastifyReply
) => {
  try {
    const token = await loginUserService(reply.server, request.body);
    reply.setCookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 2 * 60 * 60 * 1000,
      sameSite: "none",
      path: "/"
    }).send({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro de login de usuário";
    reply.code(401).send({ error: errorMessage });
  }
};
