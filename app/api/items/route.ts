import { NextRequest, NextResponse } from "next/server";
import { create, list } from "@/lib/itemStore";
import { incr } from "@/lib/redis";
import { logError, logRequest } from "@/lib/logger";

// Never execute at build time — this route hits Postgres on each request.
export const dynamic = "force-dynamic";

const PATH = "/api/items";

// GET /api/items — list all items
export async function GET() {
  const startedAt = Date.now();
  try {
    const items = await list();
    // Optional Redis: count how many times the list was fetched. Returns null
    // (and is simply omitted) when Redis is not configured.
    const views = await incr("items:list:views");
    logRequest("GET", PATH, 200, startedAt, `${items.length} items`);
    return NextResponse.json(views === null ? { items } : { items, views });
  } catch (error) {
    logError("GET /api/items", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/items — create an item
export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.title !== "string" || body.title.trim() === "") {
      logRequest("POST", PATH, 400, startedAt, "missing title");
      return NextResponse.json(
        { error: "`title` is required and must be a non-empty string" },
        { status: 400 },
      );
    }
    if (typeof body.description !== "string" || body.description.trim() === "") {
      logRequest("POST", PATH, 400, startedAt, "missing description");
      return NextResponse.json(
        { error: "`description` is required and must be a non-empty string" },
        { status: 400 },
      );
    }
    const item = await create({
      title: body.title,
      description: body.description,
      done: body.done,
    });
    logRequest("POST", PATH, 201, startedAt, `created #${item.id}`);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    logError("POST /api/items", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
