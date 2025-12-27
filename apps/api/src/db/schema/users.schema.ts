import { z } from '@hono/zod-openapi';
import type { SQL } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = sqliteTable(
  'users',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text('updated_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [
    // uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ],
);

export function lower(email: AnySQLiteColumn): SQL {
  return sql`lower(${email})`;
}

export const userSelectSchema = createSelectSchema(users);
export const userCreateSchema = createInsertSchema(users, {
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
