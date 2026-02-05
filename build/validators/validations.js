"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = exports.CreateRequestSchema = void 0;
const zod_1 = require("zod");
const validationsMessages = {
    Endereco: {
        Required: "Endereço é obrigatório",
        Min: "Endereço deve ter pelo menos 5 caracteres",
        Max: "Endereço inválido"
    },
    PontoReferencia: {
        Max: "Ponto de referência muito longo (máximo 200 caracteres)"
    },
    Descricao: {
        Required: "Descrição é obrigatória",
        Min: "Descreva o ocorrido com pelo menos 10 caracteres",
        Max: "Descrição muito longa (máximo 1000 caracteres)"
    }
};
exports.CreateRequestSchema = zod_1.z.object({
    address: zod_1.z.string()
        .min(1, validationsMessages.Endereco.Required)
        .min(5, validationsMessages.Endereco.Min)
        .max(300, validationsMessages.Endereco.Max),
    reference: zod_1.z.string()
        .optional(),
    description: zod_1.z.string()
        .min(1, validationsMessages.Descricao.Required)
        .min(10, validationsMessages.Descricao.Min)
        .max(1000, validationsMessages.Descricao.Max),
});
exports.idSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
