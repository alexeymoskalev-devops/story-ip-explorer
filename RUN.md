# Run on aeneid testnet — story-ip-explorer

Next.js dashboard over the `story-subgraph` GraphQL API.

**Depends on:** a running subgraph endpoint — bring up `../story-subgraph` first (see its `RUN.md`) for a local graph-node, or use a hosted (Goldsky) URL.

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_SUBGRAPH_URL=http://localhost:8000/subgraphs/name/story-subgraph
npm run dev                  # http://localhost:3000 (Overview) + http://localhost:3000/explorer
```

In `/explorer`, enter an IP id, e.g. `0x0b4df5a3d6dfe94dc8dc28f26006fa25638b351d` → see its parent/derivative graph + detail panel.

No-browser data-path check (runs the explorer's queries against the endpoint):
```bash
NEXT_PUBLIC_SUBGRAPH_URL=http://localhost:8000/subgraphs/name/story-subgraph node scripts/smoke.mjs
```

Tests: `npm test` (vitest: validate + transform). Build: `npm run build`.

**Public:** deploy to Vercel; set `NEXT_PUBLIC_SUBGRAPH_URL` to the hosted (Goldsky) subgraph URL.

See `../story_contrib/RUN.md`.
