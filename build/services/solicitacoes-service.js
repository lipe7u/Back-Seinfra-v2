"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RequestsService {
    static async CreateRequest({ body, userId }) {
        const setorResponsavel = 2;
        const request = await prisma.registro_ordens.create({
            data: {
                id_solicitante: userId,
                setor_resp: setorResponsavel,
                endereco: body.address,
                referencia: body.landmark,
                descricao: body.description,
                status: "PENDENTE",
                data_criacao: new Date(),
            },
        });
        return {
            id: request.id_ordem,
            mensagem: "Solicitação criada com sucesso",
            request,
        };
    }
    static async ListRequests(userId) {
        const requests = await prisma.registro_ordens.findMany({
            where: {
                id_solicitante: userId,
            },
            select: {
                id_ordem: true,
                endereco: true,
                referencia: true,
                descricao: true,
                imagens_ordens: true,
                status: true,
                data_criacao: true,
                data_conclusao: true,
                usuarios: {
                    select: {
                        nome: true,
                        telefone: true,
                        cpf: true,
                    }
                }
            },
            orderBy: {
                data_criacao: "desc",
            },
        });
        const formattedRequests = requests.map((s) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return ({
                id: s.id_ordem,
                solicitante: {
                    nome: (_b = (_a = s.usuarios) === null || _a === void 0 ? void 0 : _a.nome) !== null && _b !== void 0 ? _b : null,
                    telefone: (_d = (_c = s.usuarios) === null || _c === void 0 ? void 0 : _c.telefone) !== null && _d !== void 0 ? _d : null,
                    cpf: (_f = (_e = s.usuarios) === null || _e === void 0 ? void 0 : _e.cpf) !== null && _f !== void 0 ? _f : null,
                },
                adress: s.endereco,
                landmark: s.referencia,
                problem: s.descricao.slice(0, 200) + (s.descricao.length > 200 ? "..." : ""),
                status: this.formatStatus(s.status),
                dateRequest: s.data_criacao ? s.data_criacao.toLocaleDateString("pt-BR") : null,
                dateRequestConcluded: (_h = (_g = s.data_conclusao) === null || _g === void 0 ? void 0 : _g.toLocaleDateString("pt-BR")) !== null && _h !== void 0 ? _h : null,
            });
        });
        return formattedRequests;
    }
    static formatStatus(status) {
        const statusMap = {
            FINALIZADA: "Finalizada",
            EM_EXECUCAO: "Em execução",
            PENDENTE: "Pendente",
        };
        return statusMap[status] || status;
    }
}
exports.RequestsService = RequestsService;
