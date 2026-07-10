// Idempotent migration + seed. Safe to run repeatedly.
// Run separately before `start`, e.g.  npm run migrate
// Reads DATABASE_URL from the environment — never hardcode credentials.

const { Pool } = require("pg");

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      done        BOOLEAN NOT NULL DEFAULT false
    );
  `);
  // Backfill the description column on tables created before it existed.
  await pool.query(
    "ALTER TABLE items ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT ''",
  );
  console.log("[migrate] items table ready");

  // Seed sample rows only when the table is empty, so re-runs don't duplicate.
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM items");
  if (rows[0].count === 0) {
    await pool.query(
      "INSERT INTO items (title, description, done) VALUES ($1, $2, $3), ($4, $5, $6)",
      [
        "First item",
        "The first sample item",
        false,
        "Second item",
        "The second sample item",
        false,
      ],
    );
    console.log("[migrate] seeded 2 sample items");
  } else {
    console.log(`[migrate] items already has ${rows[0].count} rows — skip seed`);
  }

  await pool.end();
  console.log("[migrate] done");
}

main().catch((err) => {
  console.error("[migrate] failed:", err);
  process.exit(1);
});
