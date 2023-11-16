import { z } from "zod";
import axios from "axios";
import { API_URL } from "..";

axios.defaults.baseURL = API_URL;

export const ACCESS_USER_KEY = {
  getAccessUsers: "getAccessUsers",
};

const GetAccessUser = z.object({
  id: z.string(),
  sel: z.boolean(),
  name: z.string(),
  email: z.string(),
  companyId: z.string(),
  phone: z.string(),
  activation: z.boolean(),
  lastAccess: z.string(),
  user: z.string(),
  client: z.string(),
  product: z.string(),
  team: z.string(),
  history: z.string(),
});

type GetAccessUserType = z.infer<typeof GetAccessUser>;

export async function getAccessApi(companyId: string, name: string): Promise<GetAccessUserType[]> {
  return axios.get(`/user-access?companyId=${companyId}&name=${name}`).then((res) => res.data);
}
