"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RequestsService {
    static async CreateRequest({ body, userId }) {
        const setorResponsavel = 2;
        const request = await prisma.record_orders.create({
            data: {
                id_applicant: userId,
                sector_resp: setorResponsavel,
                address: body.address,
                reference: body.reference,
                description: body.description,
                status: "PENDENTE",
                creation_date: new Date(),
            },
        });
        return {
            id: request.id_order,
            message: "Solicitação criada com sucesso",
            request,
        };
    }
    static async ListRequests(userId) {
        const requests = await prisma.record_orders.findMany({
            where: {
                id_applicant: userId,
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
                        phone: true,
                        cpf: true,
                    }
                }
            },
            orderBy: {
                creation_date: "desc",
            },
        });
        const formattedRequests = requests.map((s) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return ({
                id: s.id_order,
                users: {
                    name: (_b = (_a = s.users) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null,
                    phone: (_d = (_c = s.users) === null || _c === void 0 ? void 0 : _c.phone) !== null && _d !== void 0 ? _d : null,
                    cpf: (_f = (_e = s.users) === null || _e === void 0 ? void 0 : _e.cpf) !== null && _f !== void 0 ? _f : null,
                },
                address: s.address,
                reference: s.reference,
                problem: s.description.slice(0, 200) + (s.description.length > 200 ? "..." : ""),
                status: this.formatStatus(s.status),
                dateRequest: s.creation_date ? s.creation_date.toLocaleDateString("pt-BR") : null,
                dateRequestConcluded: (_h = (_g = s.concluded_date) === null || _g === void 0 ? void 0 : _g.toLocaleDateString("pt-BR")) !== null && _h !== void 0 ? _h : null,
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
