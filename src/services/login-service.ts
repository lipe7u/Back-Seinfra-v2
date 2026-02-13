import * as bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { LoginAdminB, LoginB } from "../interface/auth-interfaces";
import { prisma } from "../server";

export const loginUserService = async (app: FastifyInstance, data: LoginB) => {
  try {
    const user = data.cpf
      ? await prisma.users.findUnique({ where: { cpf: data.cpf } })
      : await prisma.users.findFirst({ where: { phone: data.phone } });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (!user.password_hash) {
      throw new Error("Senha não encontrada");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Erro no credenciamento");
    }

    const token = app.jwt.sign({ id: user.id_user, role: user.role });
    
    return token;
  } catch (error) {
    console.error("Erro ao fazer login:", error);

    if (error instanceof Error) { 
       throw error
    }
    
    throw new Error("Error interno no servidor")
  }
};


export const loginAdminService = async (app: FastifyInstance, data: LoginAdminB) => {
  const admin = await prisma.users.findUnique({
    where: { cpf: data.cpf },
  });

  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Admin não encontrado");
  }

  const validPassword = await bcrypt.compare(data.password, admin.password_hash || "");
  if (!validPassword) {
    throw new Error("Senha incorreta");
  }
  const token = app.jwt.sign({id: admin.id_user, role: admin.role})
  return token
};

