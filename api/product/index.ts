import { z } from "zod";
import axios from "axios";
import { API_URL } from "..";

axios.defaults.baseURL = API_URL;

export const PRODUCT_KEYS = {
  getProduct: "getProduct",
};

export const CreateProduct = z.object({
  name: z.string().min(1, "Company name must contain at least 1 character(s)"),
  description: z.string(),
  companyId: z.string()
},);

const GetProduct = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  description: z.string(), 
  priority: z.string(),
});

export type CreateProductType = z.infer<typeof CreateProduct>;
type GetProductType = z.infer<typeof GetProduct>;

export async function createProductApi(data: CreateProductType) {
  const company_id = data.companyId
  delete data['companyId']
  return axios.post(`/company/${company_id}/product`, data).then((res) => res.data);
}

export async function getProductsApi(companyId: string): Promise<GetProductType[]> {
  return axios.get(`/company/${companyId}/product`).then((res) => res.data);
}


export async function getProductByIdApi(companyId: string, productId: string): Promise<GetProductType> {
  return axios.get(`/company/${companyId}/product/${productId}`).then((res) => res.data);
}

export async function deleteProductApi(companyId: string, productId: string): Promise<void> {
  return axios.delete(`/company/${companyId}/product/${productId}`).then((res) => res.data);
}

export async function updateProductApi(companyId: string, productId: string): Promise<void> {
  return axios.patch(`/company/${companyId}/product/${productId}`).then((res) => res.data);
}

