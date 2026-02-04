"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatusOrder = exports.cancelOrder = exports.requestOrdersInfo = void 0;
const server_1 = require("../server");
const orders_query_1 = require("../validators/orders-query");
const requestOrdersInfo = async (request, reply) => {
    const info = orders_query_1.ordersqueryschema.parse(request.query);
    const ordersAndServices = await server_1.prisma.registro_ordens.findMany({
        orderBy: {
            data_criacao: 'desc'
        }
    });
    if (info.mensagem == "recente") {
        reply.send(ordersAndServices);
    }
    else if (info.mensagem == 'pendente') {
        reply.send(ordersAndServices.filter((ordem) => ordem.status === "PENDENTE"));
    }
    else if (info.mensagem == 'concluido') {
        reply.send(ordersAndServices.filter((ordem) => ordem.status === "CONCLUIDO"));
    }
    else if (!isNaN(Number(info.mensagem))) {
        reply.send(ordersAndServices.filter((ordem) => ordem.id_ordem === Number(info.mensagem)));
    }
};
exports.requestOrdersInfo = requestOrdersInfo;
const cancelOrder = async (request, reply) => {
    const body = request.body;
    if (!body.id_ordem) {
        reply.status(400).send('é preciso do ID da ordem para cancelar');
        return;
    }
    if (!body.justificativa) {
        reply.status(400).send('é preciso uma justificativa para cancelar');
        return;
    }
    const order = await server_1.prisma.registro_ordens.findUnique({
        where: { id_ordem: Number(body.id_ordem) }
    });
    if (!order) {
        reply.status(404).send('Ordem não encontrada');
        return;
    }
    const canceledOrder = await server_1.prisma.registro_ordens.update({
        where: { id_ordem: Number(body.id_ordem) },
        data: {
            status: "CANCELADO",
            Justificativa: body.justificativa
        }
    });
    reply.send(`ordem "${canceledOrder.id_ordem}" de descrição "${canceledOrder.descricao}" foi cancelada. -${canceledOrder.Justificativa}`);
};
exports.cancelOrder = cancelOrder;
const changeStatusOrder = async (request, reply) => {
    const body = request.body;
    if (!body.id_ordem || !body.status) {
        return reply.status(400).send("ID da ordem e status são obrigatórios");
    }
    const order = await server_1.prisma.registro_ordens.findUnique({
        where: { id_ordem: body.id_ordem },
    });
    if (!order) {
        return reply.status(404).send("Ordem não encontrada");
    }
    const updateOrder = await server_1.prisma.registro_ordens.update({
        where: { id_ordem: body.id_ordem },
        data: {
            status: body.status,
        },
    });
    return reply.send({
        message: "Status atualizado com sucesso",
        ordem: updateOrder,
    });
};
exports.changeStatusOrder = changeStatusOrder;
