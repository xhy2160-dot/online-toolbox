// server/db/index.ts
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

// Global type placeholder declaration for Drizzle's MySQL client wrapper framework instance
type DatabaseInstance = MySql2Database<typeof schema>

let pool: mysql.Pool | null = null
let _db: DatabaseInstance | null = null

export function getDb(): DatabaseInstance {
    if (_db) return _db

    const config = useRuntimeConfig()

    if (!config.databaseUrl) {
        throw new Error("Missing databaseUrl inside runtimeConfig options matrix.")
    }

    // 1. Singleton guard: Check and instantiate the underlying connection pool exactly once
    if (!pool) {
        pool = mysql.createPool(config.databaseUrl)
    }

    // 2. Bind the driver pool to Drizzle
    _db = drizzle(pool, { schema, mode: 'default' })

    return _db
}

// 3. Ultra-convenient dynamic Proxy export helper
export const db = new Proxy({} as DatabaseInstance, {
    get(_, prop) {
        const instance = getDb()
        return Reflect.get(instance, prop)
    }
})