import { query } from "../lib/graphql";
import { OVERVIEW, TOP_IPS } from "../lib/queries";
import { toOverviewMetrics, toTopIps, type OverviewRaw, type TopIpsRaw } from "../lib/transform";
import { MetricCard } from "../components/MetricCard";
import { TopIpsTable } from "../components/TopIpsTable";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Overview() {
  let metrics, tops;
  try {
    const ov = await query<OverviewRaw>(OVERVIEW);
    const tp = await query<TopIpsRaw>(TOP_IPS);
    metrics = toOverviewMetrics(ov);
    tops = toTopIps(tp);
  } catch (e) {
    return <main className="p-8 text-red-600">Subgraph error: {e instanceof Error ? e.message : String(e)}</main>;
  }
  return (
    <main className="mx-auto max-w-5xl p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Story IP Explorer</h1>
        <Link className="text-blue-600 underline" href="/explorer">Lineage explorer →</Link>
      </div>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <MetricCard label="IP assets" value={metrics.totalIp} />
        <MetricCard label="Derivative links" value={metrics.totalDerivatives} />
        <MetricCard label="Royalty paid (total)" value={metrics.totalRoyaltyPaid} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TopIpsTable title="Top IPs by derivatives" rows={tops.byDerivatives} metric="derivativeCount" />
        <TopIpsTable title="Royalty leaders" rows={tops.byRoyalty} metric="royaltyPaidTotal" />
      </div>
    </main>
  );
}
