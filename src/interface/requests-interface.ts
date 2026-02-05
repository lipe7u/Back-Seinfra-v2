export interface RequestInput {
  address: string;
  reference?: string;
  description: string;
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
  dateRequestConcluded: string | null;
}
