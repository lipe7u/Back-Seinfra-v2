import { prisma } from "../server";
import { FastifyReply, FastifyRequest } from 'fastify';
import { ordersqueryschema } from "../validators/orders-query";

export const requestOrdersInfo = async(
  request: FastifyRequest,
  reply: FastifyReply,
) => {

  const info = ordersqueryschema.parse(request.query);
  const ordersAndServices = await prisma.registro_ordens.findMany({
    orderBy: {
      data_criacao: 'desc'
    }
  });

  if (info.mensagem == "recente") {

    reply.send(ordersAndServices);
  }
  else if (info.mensagem == 'pendente') {
    reply.send(ordersAndServices.filter((ordem: typeof ordersAndServices[number]) => ordem.status === "PENDENTE"))
  }
  else if (info.mensagem == 'concluido') {
    reply.send(ordersAndServices.filter((ordem:typeof ordersAndServices[number]) => ordem.status === "CONCLUIDO"))
  }
  else if (!isNaN(Number(info.mensagem))) {
    reply.send(ordersAndServices.filter((ordem: typeof ordersAndServices[number]) => ordem.id_ordem === Number(info.mensagem)))
  }
}

export const cancelOrder = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { id_ordem?: number; justificativa?: string };

    if (!body.id_ordem) {
      reply.status(400).send('é preciso do ID da ordem para cancelar');
      return;
    }
    if (!body.justificativa) {
      reply.status(400).send('é preciso uma justificativa para cancelar');
      return;
    }

    const order = await prisma.registro_ordens.findUnique({
      where: { id_ordem: Number(body.id_ordem) }
    });

    if (!order) {
      reply.status(404).send('Ordem não encontrada');
      return;
    }

    const canceledOrder = await prisma.registro_ordens.update({
      where: { id_ordem: Number(body.id_ordem) },
      data: {
        status: "CANCELADO",
        Justificativa: body.justificativa
      }
    });

    reply.send(`ordem "${canceledOrder.id_ordem}" de descrição "${canceledOrder.descricao}" foi cancelada. -${canceledOrder.Justificativa}`);
};

export const changeStatusOrder = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const body = request.body as {
    id_ordem?: number;
    status?: "PENDENTE" | "EM_EXECUCAO" | "CONCLUIDO";
  };

  if (!body.id_ordem || !body.status) {
    return reply.status(400).send("ID da ordem e status são obrigatórios");
  }

  const order = await prisma.registro_ordens.findUnique({
    where: { id_ordem: body.id_ordem },
  });

  if (!order) {
    return reply.status(404).send("Ordem não encontrada");
  }

  const updateOrder = await prisma.registro_ordens.update({
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