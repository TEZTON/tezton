import { z } from "zod";
import axios from "axios";
import { API_URL } from "..";

axios.defaults.baseURL = API_URL;

export const CompanyTypeEnum = z.enum([
  "Financeira",
  "Tecnologia",
  "Consultoria",
]);

export const CreateCompany = z.object({
  name: z.string().min(1, "Company name must contain at least 1 character(s)"),
  type: z.optional(CompanyTypeEnum).default("Consultoria"),
});

export type CreateCompanyType = z.infer<typeof CreateCompany>;

export async function createCompanyApi(data: CreateCompanyType) {
  return axios.post("/company", data).then((res) => res.data);
}
