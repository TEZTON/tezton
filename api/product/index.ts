import { z } from "zod";
import axios from "axios";
import { API_URL } from "..";

axios.defaults.baseURL = API_URL;

export const PRODUCT_KEYS = {
  getProducts: "getProducts",
};

export const GetProduct = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().nullable(),
});

export const CreateProduct = z.object({
  name: z.string().min(1, "Product name must contain at least 1 character(s)"),
  description: z.string().optional().nullable(),
  companyId: z.string().uuid(),
});

export type CreateProductType = z.infer<typeof CreateProduct>;
export type GetProductType = z.infer<typeof GetProduct>;

export async function createProductApi({
  companyId,
  name,
  description,
}: CreateProductType) {
  return axios
    .post(`/company/${companyId}/product`, { name, description })
    .then((res) => res.data);
}

export async function getProductsApi(
  companyId: string
): Promise<GetProductType[]> {
  return axios.get(`/company/${companyId}/product`).then((res) => res.data);
}
