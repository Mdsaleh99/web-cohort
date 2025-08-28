import { text, timestamp } from "drizzle-orm/gel-core";
import { integer, pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    salt: text().notNull(),
});

export const userSessions = pgTable("user_sessions", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
        .references(() => usersTable.id)
        .notNull(),
    createdAt: timestamp().defaultNow().notNull(),
});
