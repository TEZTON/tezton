import { z } from "zod";

export const DeliverableTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
});
