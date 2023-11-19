import { z } from "zod";
import axios from "axios";
import { API_URL } from "..";
import { GetProduct } from "../product";

const MAX_FILE_SIZE = 1000000;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

axios.defaults.baseURL = API_URL;

export const COMPANY_KEYS = {
  getAllCompanies: "getAllCompanies",
  getAllowedCompanies: "getAllowedCompanies",
  getCompanyById: "getCompanyById",
};

export const CompanyTypeEnum = z.enum([
  "Financeira",
  "Tecnologia",
  "Consultoria",
]);

export const CreateCompany = z.object({
  name: z.string().min(1, "Company name must contain at least 1 character(s)"),
  type: z.optional(CompanyTypeEnum).default("Consultoria"),
  companyImage: z.optional(
    z
      .any()
      .refine((files) => {
        if (!files?.[0]?.size) return true;

        return files?.[0]?.size <= MAX_FILE_SIZE;
      }, `Max file size is 1MB.`)
      .refine((files) => {
        if (!files?.[0]?.type) return true;

        return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
      }, ".jpg, .jpeg and .png files are accepted.")
  ),
});

const Companies = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  type: z.string(),
  companyImageUrl: z.string().url().optional().nullable(),
});

const GetAllowedCompanies = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  type: z.string(),
  companyImageUrl: z.string().url().optional().nullable(),
  products: z.array(GetProduct),
});

export type CreateCompanyType = z.infer<typeof CreateCompany>;
type CompaniesType = z.infer<typeof Companies>;
type GetAllowedCompaniesType = z.infer<typeof GetAllowedCompanies>;

export async function createCompanyApi(
  data: CreateCompanyType & { companyImageUrl?: string }
) {
  return axios.post("/company", data).then((res) => res.data);
}

export async function getAllCompanyApi(): Promise<CompaniesType[]> {
  return axios.get("/company").then((res) => res.data);
}

export async function getAllowedCompanyApi(): Promise<
  GetAllowedCompaniesType[]
> {
  return axios.get("/company/allowed").then((res) => res.data);
}

export async function getCompanyByIdApi(id: string): Promise<CompaniesType> {
  return axios.get(`/company/${id}`).then((res) => res.data);
}
