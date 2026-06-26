import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getRedis, isRedisEnabled } from "@/lib/redis";

// Checked at request time, never at build.
export const dynamic = "force-dynamic";

// GET /health — connectivity status for Postgres and (optional) Redis.
// Returns 200 when Postgres is reachable, 503 otherwise.
export async function GET() {
  let postgres: "ok" | "error" = "error";
  try {
    await query("SELECT 1");
    postgres = "ok";
  } catch {
    postgres = "error";
  }

  let redis: "ok" | "error" | "disabled" = "disabled";
  if (isRedisEnabled()) {
    try {
      const client = await getRedis();
      if (client) {
        await client.ping();
        redis = "ok";
      } else {
        redis = "error";
      }
    } catch {
      redis = "error";
    }
  }

  const healthy = postgres === "ok";
  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", postgres, redis },
    { status: healthy ? 200 : 503 },
  );
}
