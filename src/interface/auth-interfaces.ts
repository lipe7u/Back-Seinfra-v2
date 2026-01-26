export interface RegisterB {
  cpf: string; 
  name: string;
  phone: string; 
  password: string; 
}

export interface LoginB {
  cpf?: string;
  phone?: string;
  password: string;
}

export interface LoginAdminB {
  cpf: string;
  password: string;
}

export interface RegisterAdminB {
  cpf: string; 
  password: string; 
  phone: string;
}


