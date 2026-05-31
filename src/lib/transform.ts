export interface OverviewRaw {
  ipassets: { id: string }[];
  derivativeLinks: { id: string }[];
  royaltyPayments: { id: string; amount: string }[];
}
export interface OverviewMetrics {
  totalIp: string;
  totalDerivatives: string;
  totalRoyaltyPaid: string;
}

function cappedCount(arr: { id: string }[]): string {
  return arr.length >= 1000 ? "1000+" : String(arr.length);
}

export function toOverviewMetrics(raw: OverviewRaw): OverviewMetrics {
  const total = raw.royaltyPayments.reduce((acc, p) => acc + BigInt(p.amount), 0n);
  return {
    totalIp: cappedCount(raw.ipassets),
    totalDerivatives: cappedCount(raw.derivativeLinks),
    totalRoyaltyPaid: total.toString(),
  };
}

export interface TopIp {
  id: string;
  derivativeCount: number;
  royaltyPaidTotal: string;
}
export interface TopIpsRaw {
  byDerivatives: TopIp[];
  byRoyalty: TopIp[];
}
export function toTopIps(raw: TopIpsRaw): TopIpsRaw {
  return { byDerivatives: raw.byDerivatives, byRoyalty: raw.byRoyalty };
}

export interface CyNode { data: { id: string; center?: boolean; label?: string } }
export interface CyEdge { data: { id: string; source: string; target: string } }
export interface CyElements { nodes: CyNode[]; edges: CyEdge[] }

export interface LineageIp {
  id: string;
  parents: { parent: { id: string }; licenseTermsIds: string[] }[];
  derivatives: { child: { id: string } }[];
}

export function toLineageElements(ip: LineageIp): CyElements {
  const nodes = new Map<string, CyNode>();
  const edges: CyEdge[] = [];
  nodes.set(ip.id, { data: { id: ip.id, center: true, label: ip.id } });

  for (const p of ip.parents) {
    const pid = p.parent.id;
    if (!nodes.has(pid)) nodes.set(pid, { data: { id: pid, label: pid } });
    edges.push({ data: { id: `${pid}->${ip.id}`, source: pid, target: ip.id } });
  }
  for (const d of ip.derivatives) {
    const did = d.child.id;
    if (!nodes.has(did)) nodes.set(did, { data: { id: did, label: did } });
    edges.push({ data: { id: `${ip.id}->${did}`, source: ip.id, target: did } });
  }
  return { nodes: Array.from(nodes.values()), edges };
}
