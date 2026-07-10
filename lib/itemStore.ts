// Item data access, backed by Postgres (see lib/db.ts).
// All functions run server-side only and are awaited by route handlers.
// The table is created/seeded by scripts/migrate.js — not here.

import { query } from "./db";

export type Item = {
  id: number;
  title: string;
  description: string;
  done: boolean;
};

type CreateInput = {
  title: string;
  description?: string;
  done?: boolean;
};

type UpdateInput = {
  title?: string;
  description?: string;
  done?: boolean;
};

export async function list(): Promise<Item[]> {
  const { rows } = await query<Item>(
    "SELECT id, title, description, done FROM items ORDER BY id",
  );
  return rows;
}

export async function get(id: number): Promise<Item | undefined> {
  const { rows } = await query<Item>(
    "SELECT id, title, description, done FROM items WHERE id = $1",
    [id],
  );
  return rows[0];
}

export async function create(input: CreateInput): Promise<Item> {
  const { rows } = await query<Item>(
    `INSERT INTO items (title, description, done)
     VALUES ($1, $2, $3)
     RETURNING id, title, description, done`,
    [input.title, input.description ?? "", input.done ?? false],
  );
  return rows[0];
}

export async function update(
  id: number,
  input: UpdateInput,
): Promise<Item | undefined> {
  // COALESCE keeps the existing column when the field is not provided (null).
  const { rows } = await query<Item>(
    `UPDATE items
        SET title       = COALESCE($2, title),
            description  = COALESCE($3, description),
            done         = COALESCE($4, done)
      WHERE id = $1
      RETURNING id, title, description, done`,
    [id, input.title ?? null, input.description ?? null, input.done ?? null],
  );
  return rows[0];
}

export async function remove(id: number): Promise<boolean> {
  const { rowCount } = await query("DELETE FROM items WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}
