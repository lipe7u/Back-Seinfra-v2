import { prisma } from "../server";
import { FastifyReply, FastifyRequest } from 'fastify';
import { ordersqueryschema } from "../validators/orders-query";

export const requestOrdersInfo = async(
  request: FastifyRequest,
  reply: FastifyReply,
) => {

  const info = ordersqueryschema.parse(request.query);
  const ordersAndServices = await prisma.record_orders.findMany({
    orderBy: {
      creation_date: 'desc'
    }
  });

  if (info.message == "recente") {

    reply.send(ordersAndServices);
  }
  else if (info.message == 'pendente') {
    reply.send(ordersAndServices.filter((ordem: typeof ordersAndServices[number]) => ordem.status === "PENDENTE"))
  }
  else if (info.message == 'concluido') {
    reply.send(ordersAndServices.filter((ordem:typeof ordersAndServices[number]) => ordem.status === "CONCLUIDO"))
  }
  else if (!isNaN(Number(info.message))) {
    reply.send(ordersAndServices.filter((ordem: typeof ordersAndServices[number]) => ordem.id_order === Number(info.mensagem)))
  }
}

export const cancelOrder = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { id_order?: number; justification?: string };

    if (!body.id_order) {
      reply.status(400).send('é preciso do ID da ordem para cancelar');
      return;
    }
    if (!body.justification) {
      reply.status(400).send('é preciso uma justificativa para cancelar');
      return;
    }

    const order = await prisma.record_orders.findUnique({
      where: { id_order: Number(body.id_order) }
    });

    if (!order) {
      reply.status(404).send('Ordem não encontrada');
      return;
    }

    const canceledOrder = await prisma.record_orders.update({
      where: { id_order: Number(body.id_order) },
      data: {
        status: "CANCELADO",
        justification: body.justification
      }
    });

    reply.send(`ordem "${canceledOrder.id_order}" de descrição "${canceledOrder.description}" foi cancelada. -${canceledOrder.justification}`);
};

export const changeStatusOrder = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const body = request.body as {
    id_order?: number;
    status?: "PENDENTE" | "EM_EXECUCAO" | "CONCLUIDO";
  };

  if (!body.id_order|| !body.status) {
    return reply.status(400).send("ID da ordem e status são obrigatórios");
  }

  const order = await prisma.record_orders.findUnique({
    where: { id_order: body.id_order },
  });

  if (!order) {
    return reply.status(404).send("Ordem não encontrada");
  }

  const updateOrder = await prisma.record_orders.update({
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