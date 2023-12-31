import { z } from "zod";
import { ProductSchema } from "./product";

const MAX_FILE_SIZE = 1000000;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const CompanyTypeEnum = z.enum([
  "Financeira",
  "Tecnologia",
  "Consultoria",
]);

export const UpsertCompanySchema = z.object({
  name: z.string(),
  type: z.optional(CompanyTypeEnum).default("Consultoria"),
  companyImageUrl: z.string().url().optional().nullable(),
  companyId: z.string().uuid().optional().nullable(),
});

export const UpsertCompanyFileUploadSchema = UpsertCompanySchema.extend({
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

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  type: z.string(),
  companyImageUrl: z.string().url().optional().nullable(),
});

export const MyCompaniesSchema = z.array(
  CompanySchema.extend({ products: z.array(ProductSchema) })
);

export type CompanySchemaType = z.infer<typeof CompanySchema>;

export type UpsertCompanyFileUploadSchemaType = z.infer<
  typeof UpsertCompanyFileUploadSchema
>;

export type UpsertCompanySchemaType = z.infer<typeof UpsertCompanySchema>;
export type MyCompaniesSchemaType = z.infer<typeof MyCompaniesSchema>;
