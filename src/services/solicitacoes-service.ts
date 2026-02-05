import { PrismaClient } from "@prisma/client";
import { CreateRequestDate, FormattedRequest } from "../interface/requests-interface";

const prisma = new PrismaClient();

export class RequestsService {
  static async CreateRequest({ body, userId }: CreateRequestDate) {
    const setorResponsavel = 2;

    const request = await prisma.record_orders.create({
      data: {
        id_applicant: userId,
        sector_resp: setorResponsavel,
        address: body.address,
        reference: body.landmark,
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

  static async ListRequests(userId: number): Promise<FormattedRequest[]> {
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
          select : {
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

    const formattedRequests: FormattedRequest[] = requests.map((s: typeof requests[number]) => ({
      id: s.id_order,
      applicant: {
        name: s.users?.name ?? null,
        phone: s.users?.phone ?? null,
        cpf: s.users?.cpf ?? null,
      },
      adress: s.address, 
      landmark: s.reference,
      problem: s.description.slice(0, 200) + (s.description.length > 200 ? "..." : ""),
      status: this.formatStatus(s.status),
      dateRequest: s.creation_date ? s.creation_date.toLocaleDateString("pt-BR") : null,
      dateRequestConcluded: s.concluded_date?.toLocaleDateString("pt-BR") ?? null,
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
