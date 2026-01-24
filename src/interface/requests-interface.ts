export interface RequestInput {
  address: string;
  landmark?: string;
  description: string;
  imagemUrl?: string;
}

export interface CreateRequestDate {
  body: RequestInput;
  userId: number;
}

export interface FormattedRequest {
  id: number;
  adress: string;
  reference: string | null;
  problem: string;
  status: string;
  dateRequest: string | null;
  dateCompletion: string | null;
}
