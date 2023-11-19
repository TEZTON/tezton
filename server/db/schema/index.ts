import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";

export const usersSchema = sqliteTable("users", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const companiesSchema = sqliteTable("companies", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v4()),
  name: text("name").notNull(),
  type: text("type").notNull(),
  companyImageUrl: text("company_image_url"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  userId: text("user_id")
    .notNull()
    .references(() => usersSchema.id, { onDelete: "cascade" }),
});

export const productsSchema = sqliteTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v4()),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  companyId: text("company_id")
    .notNull()
    .references(() => companiesSchema.id, { onDelete: "cascade" }),
});

export const projectsSchema = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v4()),
  name: text("name").notNull(),
  description: text("description"),
  priority: text("priority").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  productId: text("product_id")
    .notNull()
    .references(() => productsSchema.id, { onDelete: "cascade" }),
});

export const functionalitiesSchema = sqliteTable("functionalities", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v4()),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  projectId: text("project_id")
    .notNull()
    .references(() => projectsSchema.id, { onDelete: "cascade" }),
});

export const deliverablesSchema = sqliteTable("deliverables", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => v4()),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  functionalityId: text("functionality_id")
    .notNull()
    .references(() => functionalitiesSchema.id, { onDelete: "cascade" }),
});
