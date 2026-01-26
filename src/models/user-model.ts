import { RegisterB, LoginB } from "../interface/auth-interfaces";

const registroUsuario = async (data: RegisterB) => {
  if (!data.cpf) {
    throw new Error("Cpf já cadastrado!");
  }

  if (!data.phone) {
    throw new Error("Telefone já cadastrado!");
  }
};
