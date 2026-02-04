"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRequestsPdf = void 0;
const pdf_lib_1 = require("pdf-lib");
const server_1 = require("../server");
const generateRequestsPdf = async (request, reply) => {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const { startDate, endDate } = request.query;
        if (!startDate || !endDate) {
            return reply.status(400).send({
                error: "dataInicio e dataFim são obrigatórios.",
            });
        }
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T23:59:59.999`);
        const requests = await server_1.prisma.registro_ordens.findMany({
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
        const pdfDoc = await pdf_lib_1.PDFDocument.create();
        const font = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.TimesRoman);
        const blackColor = (0, pdf_lib_1.rgb)(0, 0, 0);
        let page = pdfDoc.addPage();
        let { height } = page.getSize();
        let y = height - 50;
        const bottomMargin = 50;
        const drawText = (text, size = 12) => {
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
        drawText(`Período: ${new Date(startDate).toLocaleDateString("pt-BR")} a ${new Date(endDate).toLocaleDateString("pt-BR")}`, 12);
        y -= 20;
        for (const request of requests) {
            drawText("--------------------------------------------------");
            drawText(`OS Nº: ${request.id_ordem}`, 13);
            y -= 4;
            drawText(`Solicitante: ${(_b = (_a = request.usuarios) === null || _a === void 0 ? void 0 : _a.nome) !== null && _b !== void 0 ? _b : "Não informado"}`);
            drawText(`CPF: ${(_d = (_c = request.usuarios) === null || _c === void 0 ? void 0 : _c.cpf) !== null && _d !== void 0 ? _d : "Não informado"}`);
            drawText(`Telefone: ${(_f = (_e = request.usuarios) === null || _e === void 0 ? void 0 : _e.telefone) !== null && _f !== void 0 ? _f : "Não informado"}`);
            y -= 6;
            drawText(`Endereço: ${request.endereco}`);
            drawText(`Referência: ${(_g = request.referencia) !== null && _g !== void 0 ? _g : "Não informado"}`);
            drawText(`Descrição: ${request.descricao}`);
            drawText(`Status: ${request.status}`);
            drawText(`Data de Criação: ${request.data_criacao
                ? request.data_criacao.toLocaleDateString("pt-BR")
                : "-"}`);
            drawText(`Data de Conclusão: ${request.data_conclusao
                ? request.data_conclusao.toLocaleDateString("pt-BR")
                : "Não informada"}`);
            y -= 12;
        }
        drawText("--------------------------------------------------");
        const pdfBytes = await pdfDoc.save();
        reply.header("Content-Type", "application/pdf");
        reply.header("Content-Disposition", "attachment; filename=relatorio_os_finalizadas.pdf");
        return reply.send(pdfBytes);
    }
    catch (error) {
        console.error("Erro ao gerar PDF:", error);
        return reply.status(500).send({ error: "Erro ao gerar PDF" });
    }
};
exports.generateRequestsPdf = generateRequestsPdf;
