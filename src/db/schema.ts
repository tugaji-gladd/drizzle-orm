import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
});