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

    const existingCpf = await prisma.users.findUnique({
      where: { cpf: cleanCpf }
    })

    if (existingCpf) {
      throw new Error("CPF já cadastrado")
    }

    const existingPhone = await prisma.users.findUnique({
      where: { phone: data.phone }
    })

    if (existingPhone) {
        throw new Error("Número de telefone já cadastrado")
    }

    const passwordHashed = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.users.create({
      data: {
        cpf: data.cpf,
        name: data.name,
        phone: data.phone,
        password_hash: passwordHashed,
      },
      select: {
        id_user: true,
        cpf: true,
        name: true,
        phone: true,
        role: true, 
      }
    });
    
    return user;
  
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    
    if (error instanceof Error) {
       throw error
    }

    throw new Error("Erro interno no servidor")

  }
};

export const registerAdminService = async (data: RegisterAdminB) => {
  try {
    const cleanCpf = data.cpf.replace(/\D/g, '')
    if (!cpfValidation(cleanCpf)) { 
      throw new Error("Cpf inválido")
    }

    const existingCpf = await prisma.users.findUnique({
      where: { cpf: cleanCpf }
    })

    if (existingCpf) {
      throw new Error("CPF já cadastrado")
    }

    const existingPhone = await prisma.users.findUnique({
      where: { phone: data.phone }
    })

    if (existingPhone) {
        throw new Error("Número de telefone já cadastrado")
    }
    
    const passwordHashed = await bcrypt.hash(data.password, 10);
    
    const admin = await prisma.users.create({
      data: {
        cpf: data.cpf,
        name: data.name,
        password_hash: passwordHashed,
        phone: data.phone,
        role: "ADMIN",
      },
      select: {
        id_user: true,
        cpf: true,
        name: true,
        phone: true,
        role: true
      }
    });
    
    return admin;
  
  } catch (error) {
    console.error("Erro ao registrar admin:", error);
   
    if (error instanceof Error) {
       throw error
    }

    throw new Error("Erro interno no servidor")

  }
};
