import { PrismaClient } from "@prisma/client";
import { CreateRequestDate, FormattedRequest } from "../interface/requests-interface";

const prisma = new PrismaClient();

export class SolicitacoesService {
  static async CreateRequest({ body, userId }: CreateRequestDate) {
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

    if (body.imagemUrl && body.imagemUrl.trim() !== "") {
      await prisma.imagens_ordens.create({
        data: {
          id_os: request.id_ordem,
          caminho_arquivo: body.imagemUrl,
        },
      });
    }

    return {
      id: request.id_ordem,
      mensagem: "Solicitação criada com sucesso",
      request,
    };
  }

  static async ListRequests(userId: number): Promise<FormattedRequest[]> {
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
          select : {
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

    const formattedRequests: FormattedRequest[] = requests.map((s: typeof requests[number]) => ({
      id: s.id_ordem,
      solicitante: {
        nome: s.usuarios?.nome ?? null,
        telefone: s.usuarios?.telefone ?? null,
        cpf: s.usuarios?.cpf ?? null,
      },
      adress: s.endereco, 
      reference: s.referencia,
      problem: s.descricao.slice(0, 200) + (s.descricao.length > 200 ? "..." : ""),
      status: this.formatStatus(s.status),
      dateRequest: s.data_criacao ? s.data_criacao.toLocaleDateString("pt-BR") : null,
      dateCompletion: s.data_conclusao?.toLocaleDateString("pt-BR") ?? null,
    }));

    return formattedRequests;
  }

  private static formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      FINALIZADA: "Finalizada",
      EM_EXECUCAO: "Em execução",
      PENDENTE: "Pendente",
    };

    return statusMap[status] || status;
  }

}
