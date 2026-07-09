import { NextRequest, NextResponse } from "next/server";
import { get, remove, update } from "@/lib/itemStore";
import { logError, logRequest } from "@/lib/logger";

// Never execute at build time — this route hits Postgres on each request.
export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/items/:id — read one item
export async function GET(_request: NextRequest, { params }: Params) {
  const startedAt = Date.now();
  const path = `/api/items/${params.id}`;
  const id = parseId(params.id);
  if (id === null) {
    logRequest("GET", path, 400, startedAt, "bad id");
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const item = await get(id);
    if (!item) {
      logRequest("GET", path, 404, startedAt, "not found");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    logRequest("GET", path, 200, startedAt);
    return NextResponse.json({ item });
  } catch (error) {
    logError(`GET ${path}`, error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/items/:id — update title and/or done
export async function PATCH(request: NextRequest, { params }: Params) {
  const startedAt = Date.now();
  const path = `/api/items/${params.id}`;
  const id = parseId(params.id);
  if (id === null) {
    logRequest("PATCH", path, 400, startedAt, "bad id");
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await request.json().catch(() => null);
    if (!body || (body.title === undefined && body.done === undefined)) {
      logRequest("PATCH", path, 400, startedAt, "no fields");
      return NextResponse.json(
        { error: "Provide `title` and/or `done`" },
        { status: 400 },
      );
    }
    const item = await update(id, { title: body.title, done: body.done });
    if (!item) {
      logRequest("PATCH", path, 404, startedAt, "not found");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    logRequest("PATCH", path, 201, startedAt, `updated #${item.id}`);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    logError(`PATCH ${path}`, error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/items/:id — delete one item
export async function DELETE(_request: NextRequest, { params }: Params) {
  const startedAt = Date.now();
  const path = `/api/items/${params.id}`;
  const id = parseId(params.id);
  if (id === null) {
    logRequest("DELETE", path, 400, startedAt, "bad id");
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const removed = await remove(id);
    if (!removed) {
      logRequest("DELETE", path, 404, startedAt, "not found");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    logRequest("DELETE", path, 200, startedAt, `deleted #${id}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logError(`DELETE ${path}`, error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
