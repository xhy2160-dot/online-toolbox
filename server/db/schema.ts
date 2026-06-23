// server/db/schema.ts
import { mysqlTable, int, varchar, timestamp, text } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

// reusable base columns to spread into every table
export const baseColumns = {
    id: int('id').autoincrement().primaryKey(),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
}

export const users = mysqlTable('users', {
    ...baseColumns,
    uid: varchar('uid', { length: 36 }).$defaultFn(() => crypto.randomUUID()).notNull().unique(),
    username: varchar('username', { length: 100 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 20 }),
    password: varchar('password', { length: 255 }).notNull(),
})

export const tools = mysqlTable('tools', {
    ...baseColumns,
    name: varchar('name', { length: 255 }).notNull(),
    catId: int('cat_id').notNull(),
    clicks: int('clicks').default(0).notNull(),
    description: text('description'),
    icon: varchar('icon', { length: 500 }),
    url: varchar('url', { length: 300 }).notNull(),
})