const URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "http://localhost:8000/subgraphs/name/story-subgraph";

export async function query<T>(document: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: document, variables: variables ?? {} }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Subgraph HTTP ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors && json.errors.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("Subgraph returned no data");
  return json.data;
}
