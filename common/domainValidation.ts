import { z } from "zod";

export const companyTypeEnum = z.enum([
  "Financeira",
  "Tecnologia",
  "Consultoria",
]);

export const priorityTypeEnum = z.enum(["High", "Low", "Medium"]);
