// scripts/smoke.mjs — no-browser live check against NEXT_PUBLIC_SUBGRAPH_URL
const URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "http://localhost:8000/subgraphs/name/story-subgraph";
const IP = process.env.SMOKE_IP ?? "0x0b4df5a3d6dfe94dc8dc28f26006fa25638b351d";

const LINEAGE = `query Lineage($id: ID!, $idStr: String!) {
  ipasset(id: $id) {
    id uri parentCount derivativeCount royaltyPaidTotal
    parents { parent { id } licenseTermsIds }
    derivatives { child { id } }
    attachedTerms { licenseTermsId }
  }
  royaltyPayments(where: { receiverIp: $idStr }, first: 50, orderBy: timestamp, orderDirection: desc) {
    token amount timestamp
  }
}`;

async function gql(query, variables) {
  const res = await fetch(URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query, variables }) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  if (j.errors?.length) throw new Error(j.errors.map((e) => e.message).join("; "));
  return j.data;
}

const data = await gql(LINEAGE, { id: IP, idStr: IP });
if (!data.ipasset) { console.error("No IP found:", IP); process.exit(1); }
const ip = data.ipasset;
console.log("ipId:", ip.id);
console.log("parentCount:", ip.parentCount, "derivativeCount:", ip.derivativeCount);
console.log("parents:", ip.parents.map((p) => p.parent.id));
console.log("derivatives:", ip.derivatives.map((d) => d.child.id));
console.log("attachedTerms:", ip.attachedTerms.map((t) => t.licenseTermsId));
console.log("royaltyPayments:", data.royaltyPayments.length);
console.log("\nOK: explorer query path works against the live subgraph.");
