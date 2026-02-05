"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatusOrder = exports.cancelOrder = exports.requestOrdersInfo = void 0;
const server_1 = require("../server");
const orders_query_1 = require("../validators/orders-query");
const requestOrdersInfo = async (request, reply) => {
    const info = orders_query_1.ordersqueryschema.parse(request.query);
    const ordersAndServices = await server_1.prisma.record_orders.findMany({
        orderBy: {
            creation_date: 'desc'
        }
    });
    if (info.message == "recente") {
        reply.send(ordersAndServices);
    }
    else if (info.message == 'pendente') {
        reply.send(ordersAndServices.filter((ordem) => ordem.status === "PENDENTE"));
    }
    else if (info.message == 'concluido') {
        reply.send(ordersAndServices.filter((ordem) => ordem.status === "CONCLUIDO"));
    }
    else if (!isNaN(Number(info.message))) {
        reply.send(ordersAndServices.filter((ordem) => ordem.id_order === Number(info.message)));
    }
};
exports.requestOrdersInfo = requestOrdersInfo;
const cancelOrder = async (request, reply) => {
    const body = request.body;
    if (!body.id_order) {
        reply.status(400).send('é preciso do ID da ordem para cancelar');
        return;
    }
    if (!body.justification) {
        reply.status(400).send('é preciso uma justificativa para cancelar');
        return;
    }
    const order = await server_1.prisma.record_orders.findUnique({
        where: { id_order: Number(body.id_order) }
    });
    if (!order) {
        reply.status(404).send('Ordem não encontrada');
        return;
    }
    const canceledOrder = await server_1.prisma.record_orders.update({
        where: { id_order: Number(body.id_order) },
        data: {
            status: "CANCELADO",
            justification: body.justification
        }
    });
    reply.send(`ordem "${canceledOrder.id_order}" de descrição "${canceledOrder.description}" foi cancelada. -${canceledOrder.justification}`);
};
exports.cancelOrder = cancelOrder;
const changeStatusOrder = async (request, reply) => {
    const body = request.body;
    if (!body.id_order || !body.status) {
        return reply.status(400).send("ID da ordem e status são obrigatórios");
    }
    const order = await server_1.prisma.record_orders.findUnique({
        where: { id_order: body.id_order },
    });
    if (!order) {
        return reply.status(404).send("Ordem não encontrada");
    }
    const updateOrder = await server_1.prisma.record_orders.update({
        where: { id_order: body.id_order },
        data: {
            status: body.status,
        },
    });
    return reply.send({
        message: "Status atualizado com sucesso",
        order: updateOrder,
    });
};
exports.changeStatusOrder = changeStatusOrder;
