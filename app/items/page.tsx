"use client";

import { useEffect, useState } from "react";

type Item = { id: number; title: string; description: string; done: boolean };

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  async function refresh() {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data.items ?? []);
    setStatus(`GET /api/items → ${res.status}`);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim() === "") return;
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setStatus(`POST /api/items → ${res.status}`);
    setTitle("");
    setDescription("");
    await refresh();
  }

  async function toggle(item: Item) {
    const res = await fetch(`/api/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !item.done }),
    });
    setStatus(`PATCH /api/items/${item.id} → ${res.status}`);
    await refresh();
  }

  async function remove(item: Item) {
    const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });
    setStatus(`DELETE /api/items/${item.id} → ${res.status}`);
    await refresh();
  }

  return (
    <section data-testid="items-page">
      <h1>Items</h1>
      <p>
        A tiny CRUD form wired to the backend API. Every action hits{" "}
        <code>/api/items</code> and prints a line to the server log — handy for
        watching realtime logs while testing.
      </p>

      <form className="item-form" onSubmit={addItem} data-testid="item-form">
        <input
          type="text"
          value={title}
          placeholder="New item title"
          onChange={(e) => setTitle(e.target.value)}
          required
          data-testid="item-input"
        />
        {/* TODO: description input temporarily removed from the create form
        <input
          type="text"
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          required
          data-testid="item-description-input"
        />
        */}
        <button type="submit" data-testid="item-add">
          Add
        </button>
      </form>

      <p className="item-status" data-testid="item-status">
        {status}
      </p>

      <ul className="item-list" data-testid="item-list">
        {items.map((item) => (
          <li key={item.id} className="item-row" data-testid={`item-${item.id}`}>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggle(item)}
              data-testid={`item-toggle-${item.id}`}
            />
            <span
              className={item.done ? "item-title done" : "item-title"}
              data-testid={`item-title-${item.id}`}
            >
              {item.title}
            </span>
            {item.description ? (
              <span
                className="item-description"
                data-testid={`item-description-${item.id}`}
              >
                {item.description}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => remove(item)}
              data-testid={`item-delete-${item.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
