
export interface Medicine {
  medicine_id: number;
  name: string;
  type: string | null;
  price: number | null;
  rank: number | null;
  disease_id: string | null;
  disease: { 
    disease_id: string;
    name: string;
  } | null;
  company_id: number | null;
  company: { 
    company_id: number;
    name: string;
  } | null;
}

export interface Composition {
  composition_id: number;
  name: string;
}

export interface Company {
  company_id: number;
  name: string;
  rank: number | null;
}
