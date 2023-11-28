import { z } from "zod";

export const RequestAccessSchema = z.object({
  companyId: z.string(),
});

export const RequestAccessStatus = z.enum(["pending", "approved", "denied"]);

export type RequestAccessSchemaType = z.infer<typeof RequestAccessSchema>;
