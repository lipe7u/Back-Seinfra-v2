export interface RequestInput {
  address: string;
  landmark?: string;
  description: string;
}

export interface CreateRequestDate {
  body: RequestInput;
  userId: number;
}

export interface FormattedRequest {
  id: number;
  adress: string;
  landmark: string | null;
  problem: string;
  status: string;
  dateRequest: string | null;
  dateRequestConcluded: string | null;
}
