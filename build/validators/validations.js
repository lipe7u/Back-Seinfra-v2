"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = exports.CreateRequestSchema = void 0;
const zod_1 = require("zod");
const validationsMessages = {
    Address: {
        Required: "Endereço é obrigatório",
        Min: "Endereço deve ter pelo menos 5 caracteres",
        Max: "Endereço inválido"
    },
    Reference: {
        Max: "Ponto de referência muito longo (máximo 200 caracteres)"
    },
    Description: {
        Required: "Descrição é obrigatória",
        Min: "Descreva o ocorrido com pelo menos 10 caracteres",
        Max: "Descrição muito longa (máximo 1000 caracteres)"
    }
};
exports.CreateRequestSchema = zod_1.z.object({
    address: zod_1.z.string()
        .min(1, validationsMessages.Address.Required)
        .min(5, validationsMessages.Address.Min)
        .max(300, validationsMessages.Address.Max),
    reference: zod_1.z.string()
        .optional(),
    description: zod_1.z.string()
        .min(1, validationsMessages.Description.Required)
        .min(10, validationsMessages.Description.Min)
        .max(1000, validationsMessages.Description.Max),
});
exports.idSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
