import fastifyJwt from "fastify-jwt";

declare module "fastify-jwt" {
  interface FastifyJWT {
    payload: {
      id: number;
      role: "USER" | "ADMIN";
    };
    user: {
      id: number;
      role: "USER" | "ADMIN";
    };
  }
}