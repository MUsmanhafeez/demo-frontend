export default function Home() {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Items Demo</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Next.js frontend talking to a Node + Mongo backend.
          </p>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <Items />
        </section>
      </main>
    </div>
  );
}

type Item = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

async function api(path: string, init?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

async function Items() {
  const data = await api("/api/items");
  const items: Item[] = data.items ?? [];
console.log(items,'these are items');

  return (
    <div className="space-y-4">
      <form action={createItem} className="flex gap-2">
        <input
          name="title"
          placeholder="New item title…"
          className="h-11 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-zinc-700"
        />
        <button className="h-11 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-white">
          Add
        </button>
      </form>

      <ul className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {items.length === 0 ? (
          <li className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
            No items yet. Add one above.
          </li>
        ) : (
          items.map((item) => (
            <li key={item._id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{item.title}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
              <form action={deleteItem} className="shrink-0">
                <input type="hidden" name="id" value={item._id} />
                <button className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                  Delete
                </button>
              </form>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

async function createItem(formData: FormData) {
  "use server";
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await api("/api/items", { method: "POST", body: JSON.stringify({ title }) });
}

async function deleteItem(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await api(`/api/items/${id}`, { method: "DELETE" });
}
