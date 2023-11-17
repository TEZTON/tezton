import { z } from "zod";
import axios from "axios";
import { API_URL } from "..";

axios.defaults.baseURL = API_URL;

export const PROJECT_KEYS = {
  getProjects: "getProjects",
};

export const PriorityEnum = z.enum(["Low", "Medium", "High"]);

export const GetProject = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string(),
  priority: z.string(),
});

export const CreateProject = z.object({
  name: z.string().min(1, "Product name must contain at least 1 character(s)"),
  description: z.string().optional().nullable(),
  priority: z.optional(PriorityEnum).default("Low"),
});

export type CreatePrejectType = z.infer<typeof CreateProject>;
export type GetProjectType = z.infer<typeof GetProject>;

export async function createProjectApi({
  name,
  description,
  priority,
  productId,
}: CreatePrejectType & { productId: string }) {
  return axios
    .post(`/product/${productId}/project`, { name, description, priority })
    .then((res) => res.data);
}

export async function getProjectsApi(
  productId: string
): Promise<GetProjectType[]> {
  return axios.get(`/product/${productId}/project`).then((res) => res.data);
}
