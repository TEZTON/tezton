//COMPANIES
export type Company = {
  type: 'Financeira' | 'Tecnologia' | 'Consultoria' | string | undefined;
  name: string;
  id: string | undefined;
  createdAt: string;
  updatedAt: string;
  companyImageUrl?: string | null | undefined;
};

export type CompanyUpdate = {
  companyId: string;
  name: string;
  type: 'Financeira' | 'Tecnologia' | 'Consultoria';
  companyImageUrl?: string | null | undefined;
};

export type CompanyType = 'Financeira' | 'Tecnologia' | 'Consultoria';

export interface UpsertCompanyProps {
  initialData?: {
    id: string;
    name: string;
    type: "Financeira" | "Tecnologia" | "Consultoria";
  };
  onSuccess: () => void;
}
export interface UpdateCompany {
  type: 'Financeira' | 'Tecnologia' | 'Consultoria' | string | undefined;
  name: string;
  id: string | undefined;
  createdAt: string;
  updatedAt: string;
  companyImageUrl?: string | null | undefined;
}

//PRODUCT 
export interface AllProductsAsideProps {
  id: string;
  name: string;
  companyImageUrl?: string | null;
}

export interface UpsertProductProps {
  id?: string | undefined;
  name?: string | undefined;
  description?: string | null | undefined;
}

export interface UpsertPropsProduct {
  initialData?: {
    id: string;
    name: string;
    description: string;
  };
  companyId: string;
  productId?: string;
  onSuccessCallback: () => void;
}


export interface UpdateData {
  companyId: string;
  productId: string;
  name: string;
  description: string | null | undefined;
}

//PROJECTS 
export interface ProjectAccordionProps {
  name: string;
  projectId: string;
  companyId: string;
  productId: string;
}

export interface UpsertProjectProps {
  id?: string | undefined;
  name?: string | undefined;
  priority: "Low" | "Medium" | "High" | string | undefined;
  description?: string | null | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}
export type PriorityType = "Low" | "Medium" | "High";

export interface UpsertProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    priority: "Low" | "Medium" | "High";
  };
  productId: string;
  projectId?: string;
  companyId: string;
  onSuccess: () => void;
}

export interface UpdateProject {
  productId: string;
  projectId: string;
  name: string;
  description: string | null | undefined;
  priority: "Low" | "Medium" | "High";
}