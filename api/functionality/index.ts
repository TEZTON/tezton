import { z } from "zod";
import axios from "axios";
import { API_URL } from "..";

axios.defaults.baseURL = API_URL;

export const FUNCTIONALITY_KEYS = {
  getFunctionalities: "getFunctionalities",
};

export const GetFunctionality = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string(),
});

export const CreateFunctionality = z.object({
  name: z
    .string()
    .min(1, "Functionality name must contain at least 1 character(s)"),
  description: z.string().optional().nullable(),
});

export type CreateFunctionalityType = z.infer<typeof CreateFunctionality>;
export type GetFunctionalityType = z.infer<typeof GetFunctionality>;

export async function createFunctionalityApi({
  name,
  description,
  projectId,
}: CreateFunctionalityType & { projectId: string }) {
  return axios
    .post(`/project/${projectId}/functionality`, { name, description })
    .then((res) => res.data);
}

export async function getFunctionalitiesApi(
  projectId: string
): Promise<GetFunctionalityType[]> {
  return axios
    .get(`/project/${projectId}/functionality`)
    .then((res) => res.data);
}
