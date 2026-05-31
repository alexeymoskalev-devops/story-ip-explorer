"use client";
import { useState } from "react";
import { query } from "../../lib/graphql";
import { IP_LINEAGE } from "../../lib/queries";
import { toLineageElements, type LineageIp, type CyElements } from "../../lib/transform";
import { isValidIpId } from "../../lib/validate";
import { LineageGraph } from "../../components/LineageGraph";
import { IpDetailPanel, type IpDetail } from "../../components/IpDetailPanel";

interface LineageResp {
  ipasset: (LineageIp & { uri: string | null; parentCount: number; derivativeCount: number; royaltyPaidTotal: string; attachedTerms: { licenseTermsId: string }[] }) | null;
  royaltyPayments: { token: string; amount: string; timestamp: string }[];
}

export default function Explorer() {
  const [id, setId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [els, setEls] = useState<CyElements | null>(null);
  const [detail, setDetail] = useState<IpDetail | null>(null);

  async function run() {
    setError(null); setEls(null); setDetail(null);
    const ipId = id.trim().toLowerCase();
    if (!isValidIpId(ipId)) { setError("Enter a valid 0x… IP id (20 bytes)"); return; }
    try {
      const data = await query<LineageResp>(IP_LINEAGE, { id: ipId, idStr: ipId });
      if (!data.ipasset) { setError("No IP found for that id"); return; }
      setEls(toLineageElements(data.ipasset));
      setDetail({
        id: data.ipasset.id, uri: data.ipasset.uri,
        parentCount: data.ipasset.parentCount, derivativeCount: data.ipasset.derivativeCount,
        royaltyPaidTotal: data.ipasset.royaltyPaidTotal, attachedTerms: data.ipasset.attachedTerms,
        royaltyPayments: data.royaltyPayments,
      });
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-4 text-xl font-bold">IP Lineage Explorer</h1>
      <div className="mb-4 flex gap-2">
        <input className="flex-1 rounded border border-gray-300 px-3 py-2 font-mono text-sm" placeholder="0x… IP id"
          value={id} onChange={(e) => setId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} />
        <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Explore</button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {detail && <div className="mb-4"><IpDetailPanel ip={detail} /></div>}
      {els && <LineageGraph elements={els} />}
    </main>
  );
}
