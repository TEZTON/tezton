import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

export const CreateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name must contain at least 1 character(s)"),
  lastName: z.string().min(1, "Last name must contain at least 1 character(s)"),
  email: z.string().email(),
  password: z.string().min(8, "Password must contain at least 8 character(s)"),
});

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
