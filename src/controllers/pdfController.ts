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

    const requests = await prisma.registro_ordens.findMany({
      where: {
        status: "CONCLUIDO",
        data_criacao: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        data_criacao: "asc",
      },
      select: {
        id_ordem: true,
        endereco: true,
        referencia: true,
        descricao: true,
        status: true,
        data_criacao: true,
        data_conclusao: true,
        usuarios: {
          select: {
            nome: true,
            cpf: true,
            telefone: true,
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

      drawText(`OS Nº: ${request.id_ordem}`, 13);
      y -= 4;

      drawText(
        `Solicitante: ${request.usuarios?.nome ?? "Não informado"}`
      );
      drawText(`CPF: ${request.usuarios?.cpf ?? "Não informado"}`);
      drawText(
        `Telefone: ${request.usuarios?.telefone ?? "Não informado"}`
      );

      y -= 6;

      drawText(`Endereço: ${request.endereco}`);
      drawText(`Referência: ${request.referencia ?? "Não informado"}`);
      drawText(`Descrição: ${request.descricao}`);
      drawText(`Status: ${request.status}`);

      drawText(
        `Data de Criação: ${
          request.data_criacao
            ? request.data_criacao.toLocaleDateString("pt-BR")
            : "-"
        }`
      );

      drawText(
        `Data de Conclusão: ${
          request.data_conclusao
            ? request.data_conclusao.toLocaleDateString("pt-BR")
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
