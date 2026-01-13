import { PrismaClient } from "@prisma/client";
import { SolicitacaoInput, CriarSolicitacaoData, SolicitacaoFormatada } from "../interface/requests-interface";

const prisma = new PrismaClient();

export class SolicitacoesService {
  static async CreateRequest({ body, userId }: CriarSolicitacaoData) {
    const setorResponsavel = 2;

    const solicitacao = await prisma.registro_ordens.create({
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
          id_os: solicitacao.id_ordem,
          caminho_arquivo: body.imagemUrl,
        },
      });
    }

    return {
      id: solicitacao.id_ordem,
      mensagem: "Solicitação criada com sucesso",
      solicitacao,
    };
  }

  static async ListRequests(userId: number): Promise<SolicitacaoFormatada[]> {
    const solicitacoes = await prisma.registro_ordens.findMany({
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

    const solicitacoesFormatadas: SolicitacaoFormatada[] = solicitacoes.map((s: typeof solicitacoes[number]) => ({
      id: s.id_ordem,
      solicitante: {
        nome: s.usuarios?.nome ?? null,
        telefone: s.usuarios?.telefone ?? null,
        cpf: s.usuarios?.cpf ?? null,
      },
      adress: s.endereco, 
      reference: s.referencia,
      problem: s.descricao.slice(0, 200) + (s.descricao.length > 200 ? "..." : ""),
      status: this.formatarStatus(s.status),
      dateRequest: s.data_criacao ? s.data_criacao.toLocaleDateString("pt-BR") : null,
      dateCompletion: s.data_conclusao?.toLocaleDateString("pt-BR") ?? null,
    }));

    return solicitacoesFormatadas;
  }

  private static formatarStatus(status: string): string {
    const statusMap: Record<string, string> = {
      FINALIZADA: "Finalizada",
      EM_EXECUCAO: "Em execução",
      PENDENTE: "Pendente",
    };

    return statusMap[status] || status;
  }

}
