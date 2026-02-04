import * as bcrypt from "bcryptjs";
import { RegisterAdminB, RegisterB } from "../interface/auth-interfaces";
import { prisma } from "../server";
import { cpfValidation } from "../utils/cpf-validation";

export const registerUserService = async (data: RegisterB) => {
  try {
    const cleanCpf = data.cpf.replace(/\D/g, '')
    if (!cpfValidation(cleanCpf)) { 
      throw new Error("Cpf inválido")
    }

    const existingCpf = await prisma.usuarios.findUnique({
      where: { cpf: cleanCpf }
    })

    if (existingCpf) {
      throw new Error("CPF já cadastrado")
    }

    const passwordHashed = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.usuarios.create({
      data: {
        cpf: data.cpf,
        nome: data.name,
        telefone: data.phone,
        senha_hash: passwordHashed,
      },
    });
    return user;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw new Error("Erro ao registrar usuário");
  }
};

export const registerAdminService = async (data: RegisterAdminB) => {
  try {
    const cleanCpf = data.cpf.replace(/\D/g, '')
    if (!cpfValidation(cleanCpf)) { 
      throw new Error("Cpf inválido")
    }

    const existingCpf = await prisma.usuarios.findUnique({
      where: { cpf: cleanCpf }
    })

    if (existingCpf) {
      throw new Error("CPF já cadastrado")
    }
    
    const passwordHashed = await bcrypt.hash(data.password, 10);
    
    const admin = await prisma.usuarios.create({
      data: {
        cpf: data.cpf,
        senha_hash: passwordHashed,
        telefone: data.phone,
        Admin: true,
      },
    });
    return admin;
  } catch (error) {
    console.error("Erro ao registrar admin:", error);
    throw new Error("Erro ao registrar admin");
  }
};
