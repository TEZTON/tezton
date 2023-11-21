import { z } from "zod";
import axios from "axios";
import { API_URL } from "..";

axios.defaults.baseURL = API_URL;

export const COMPANY_KEYS = {
  getCompanies: "getCompanies",
};

export const CompanyTypeEnum = z.enum([
  "Financeira",
  "Tecnologia",
  "Consultoria",
]);

export const CreateCompany = z.object({
  name: z.string().min(1, "Company name must contain at least 1 character(s)"),
  type: z.optional(CompanyTypeEnum).default("Consultoria"),
});

const GetCompany = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  type: z.string(),
});

export type CreateCompanyType = z.infer<typeof CreateCompany>;
type GetCompanyType = z.infer<typeof GetCompany>;

export async function createCompanyApi(data: CreateCompanyType) {
  return axios.post("/company", data).then((res) => res.data);
}

export async function getCompanyApi(): Promise<GetCompanyType[]> {
  return axios.get("/company/allowed").then((res) => res.data);
}
