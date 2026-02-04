import { FastifyRequest, FastifyReply } from "fastify";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "../server";

export const generateRequestsPdf = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { startDate, endDate } = request.query as {
      startDate: string;
      endDate: string;
    };

    if (!startDate || !endDate) {
      return reply.status(400).send({
        error: "dataInicio e dataFim são obrigatórios.",
      });
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59.999`);

    const requests = await prisma.record_orders.findMany({
      where: {
        status: "CONCLUIDO",
        creation_date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        creation_date: "asc",
      },
      select: {
        id_order: true,
        address: true,
        reference: true,
        description: true,
        status: true,
        creation_date: true,
        concluded_date: true,
        users: {
          select: {
            name: true,
            cpf: true,
            phone: true,
          },
        },
      },
    });

    if (requests.length === 0) {
      return reply.status(404).send({
        error: "Nenhuma solicitação encontrada no período informado.",
      });
    }

    // ================= PDF =================
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const blackColor = rgb(0, 0, 0);

    let page = pdfDoc.addPage();
    let { height } = page.getSize();
    let y = height - 50;

    const bottomMargin = 50;

    const drawText = (text: string, size = 12) => {
      if (y < bottomMargin) {
        page = pdfDoc.addPage();
        ({ height } = page.getSize());
        y = height - 50;
      }

      page.drawText(text, {
        x: 30,
        y,
        size,
        font,
        color: blackColor,
      });

      y -= size + 6;
    };

    drawText("RELATÓRIO DE ORDENS DE SERVIÇO CONCLUÍDAS", 16);
    y -= 4;
    drawText(
      `Período: ${new Date(startDate).toLocaleDateString("pt-BR")} a ${new Date(
        endDate
      ).toLocaleDateString("pt-BR")}`,
      12
    );

    y -= 20;

    for (const request of requests) {
      drawText("--------------------------------------------------");

      drawText(`OS Nº: ${request.id_order}`, 13);
      y -= 4;

      drawText(
        `Solicitante: ${request.users?.name ?? "Não informado"}`
      );
      drawText(`CPF: ${request.users?.cpf ?? "Não informado"}`);
      drawText(
        `Telefone: ${request.users?.phone ?? "Não informado"}`
      );

      y -= 6;

      drawText(`Endereço: ${request.address}`);
      drawText(`Referência: ${request.reference ?? "Não informado"}`);
      drawText(`Descrição: ${request.description}`);
      drawText(`Status: ${request.status}`);

      drawText(
        `Data de Criação: ${
          request.creation_date
            ? request.creation_date.toLocaleDateString("pt-BR")
            : "-"
        }`
      );

      drawText(
        `Data de Conclusão: ${
          request.concluded_date
            ? request.concluded_date.toLocaleDateString("pt-BR")
            : "Não informada"
        }`
      );

      y -= 12;
    }

    drawText("--------------------------------------------------");

    const pdfBytes = await pdfDoc.save();

    reply.header("Content-Type", "application/pdf");
    reply.header(
      "Content-Disposition",
      "attachment; filename=relatorio_os_finalizadas.pdf"
    );

    return reply.send(pdfBytes);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return reply.status(500).send({ error: "Erro ao gerar PDF" });
  }
};
