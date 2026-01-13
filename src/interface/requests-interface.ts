export interface SolicitacaoInput {
  address: string;
  landmark?: string;
  description: string;
  imagemUrl?: string;
}

export interface CriarSolicitacaoData {
  body: SolicitacaoInput;
  userId: number;
}

export interface SolicitacaoFormatada {
  id: number;
  adress: string;
  reference: string | null;
  problem: string;
  status: string;
  dateRequest: string | null;
  dateCompletion: string | null;
}
