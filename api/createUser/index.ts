import { z } from "zod";
import axios from "axios";
import { API_URL } from "..";

export const CreateUser = z.object({
  firstName: z
    .string()
    .min(1, "First name must contain at least 1 character(s)"),
  lastName: z.string().min(1, "Last name must contain at least 1 character(s)"),
  email: z.string().email(),
  password: z.string().min(8, "Password must contain at least 8 character(s)"),
});

export type CreateUserType = z.infer<typeof CreateUser>;

export async function createUserApi(data: CreateUserType) {
  return axios.post(`${API_URL}/user`, data).then((res) => res.data);
}
