// shared/types/tool.ts
import type { tools } from '~~/server/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

// raw DB type — used server-side only
export type Tool = InferSelectModel<typeof tools>

// client-side type — matches what actually arrives after JSON serialization
export type SerializedTool = Omit<Tool, 'createdAt' | 'updatedAt'> & {
    createdAt: string
    updatedAt: string
}