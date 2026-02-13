import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "fastify-jwt";
import fastifyCookie from "@fastify/cookie";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

import authRoutes from "./routes/global-routes";

dotenv.config();

export const app = fastify();
export const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não encontrado no .env");
}

app.register(fastifyCookie)

app.register(fastifyCors, {
  origin: [
    "https://seinfra.com.br",
    "https://www.seinfra.com.br",
    "https://admin.seinfra.com.br"
  ],
  credentials: true,
});


app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "token",
    signed: false
  }
});

app.decorate("verifyAdmin", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify()

    if (request.user.role !== "ADMIN") {
      return reply.code(403).send({
        message: "Acesso restrito a administradores"
      })
    }
  } catch {
    return reply.code(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Token inválido ou ausente"
    })

  }
})

app.register(authRoutes);

// Log básico de requisição
app.addHook("preHandler", async (request, reply) => {
  console.log("======== ROTA RECEBIDA ========");
  console.log("method:", request.method);
  console.log("url:", request.url);
  console.log("================================");

  const route = request.url.split("?")[0];

  const publicRoutes = [
    "/registro",
    "/login",
    "/logout",
    "/login-admin"
  ];

  if (publicRoutes.includes(route)) {
    return;
  }

  try {
    await request.jwtVerify();
  } catch {
    return reply.code(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Token inválido ou ausente",
    });
  }
});


const port = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await app.listen({ port, host: "0.0.0.0" });
    console.log("Servidor rodando em: http://localhost:${port}");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();