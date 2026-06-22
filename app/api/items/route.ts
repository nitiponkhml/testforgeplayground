import { NextRequest, NextResponse } from "next/server";
import { create, list } from "@/lib/itemStore";
import { logError, logRequest } from "@/lib/logger";

const PATH = "/api/items";

// GET /api/items — list all items
export async function GET() {
  const startedAt = Date.now();
  const items = list();
  logRequest("GET", PATH, 200, startedAt, `${items.length} items`);
  return NextResponse.json({ items });
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
    const item = create({ title: body.title, done: body.done });
    logRequest("POST", PATH, 201, startedAt, `created #${item.id}`);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    logError("POST /api/items", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
