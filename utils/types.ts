export interface UpsertCompanyProps {
  initialData?: {
    id: string;
    name: string;
    type: "Financeira" | "Tecnologia" | "Consultoria";
  };
  onSuccess: () => void;
}

//PRODUCT 
export interface AllProductsAsideProps {
  id: string;
  name: string;
  companyImageUrl?: string | null;
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

//PROJECTS 
export interface ProjectAccordionProps {
  name: string;
  projectId: string;
  companyId: string;
  productId: string;
}

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