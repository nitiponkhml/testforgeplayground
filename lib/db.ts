// Single shared Postgres pool, reused across the whole app.
// Reads DATABASE_URL from the environment — never hardcode credentials.
// The pool is created lazily on first query, so importing this module does NOT
// open a connection at build time.

import { Pool, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params as never);
}
