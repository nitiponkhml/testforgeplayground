// In-memory store for CRUD items. Resets on server restart — fine for a
// testsuite fixture. Not persistent and not concurrency-safe by design.

export type Item = {
  id: number;
  title: string;
  done: boolean;
};

type CreateInput = {
  title: string;
  done?: boolean;
};

type UpdateInput = {
  title?: string;
  done?: boolean;
};

let nextId = 1;
const items = new Map<number, Item>();

// Seed a couple of rows so list/read tests have data on a fresh start.
function seed(): void {
  if (items.size > 0) return;
  for (const title of ["First item", "Second item"]) {
    const id = nextId++;
    items.set(id, { id, title, done: false });
  }
}
seed();

export function list(): Item[] {
  return [...items.values()].sort((a, b) => a.id - b.id);
}

export function get(id: number): Item | undefined {
  return items.get(id);
}

export function create(input: CreateInput): Item {
  const id = nextId++;
  const item: Item = { id, title: input.title, done: input.done ?? false };
  items.set(id, item);
  return item;
}

export function update(id: number, input: UpdateInput): Item | undefined {
  const existing = items.get(id);
  if (!existing) return undefined;
  const updated: Item = {
    ...existing,
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.done !== undefined ? { done: input.done } : {}),
  };
  items.set(id, updated);
  return updated;
}

export function remove(id: number): boolean {
  return items.delete(id);
}
