"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registroUsuario = async (data) => {
    if (!data.cpf) {
        throw new Error("Cpf já cadastrado!");
    }
    if (!data.phone) {
        throw new Error("Telefone já cadastrado!");
    }
};
