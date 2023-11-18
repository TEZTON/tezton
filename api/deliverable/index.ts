import { z } from "zod";
import axios from "axios";
import { API_URL } from "..";

axios.defaults.baseURL = API_URL;

export const DELIVERABLE_KEYS = {
  getDeliverables: "getDeliverables",
};

export const GetDeliverable = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string(),
});

export const CreateDeliverable = z.object({
  name: z
    .string()
    .min(1, "Deliverable name must contain at least 1 character(s)"),
  description: z.string().optional().nullable(),
});

export type CreateDeliverableType = z.infer<typeof CreateDeliverable>;
export type GetDeliverableType = z.infer<typeof GetDeliverable>;

export async function createDeliverableApi({
  name,
  description,
  functionalityId,
}: CreateDeliverableType & { functionalityId: string }) {
  return axios
    .post(`/functionality/${functionalityId}/deliverable`, {
      name,
      description,
    })
    .then((res) => res.data);
}

export async function getDeliverablesApi(
  functionalityId: string
): Promise<GetDeliverableType[]> {
  return axios
    .get(`/functionality/${functionalityId}/deliverable`)
    .then((res) => res.data);
}
