"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRequests = exports.CreateRequests = void 0;
const validations_1 = require("../validators/validations");
const solicitacoes_service_1 = require("../services/solicitacoes-service");
const zod_1 = require("zod");
const CreateRequests = async (request, reply) => {
    try {
        const body = validations_1.CreateRequestSchema.parse(request.body);
        const { id: userId } = request.user;
        const result = await solicitacoes_service_1.RequestsService.CreateRequest({
            body,
            userId
        });
        return reply.status(201).send(result);
    }
    catch (error) {
        const errorMessage = error instanceof zod_1.z.ZodError
            ? error.format()
            : "Erro ao criar solicitação";
        return reply.status(400).send({ error: errorMessage });
    }
};
exports.CreateRequests = CreateRequests;
const ListRequests = async (request, reply) => {
    try {
        const { id: id_user } = request.user;
        const requests = await solicitacoes_service_1.RequestsService.ListRequests(id_user);
        return reply.send(requests);
    }
    catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "Erro ao listar solicitaçôes";
        return reply.status(500).send({ error: errorMessage });
    }
};
exports.ListRequests = ListRequests;
