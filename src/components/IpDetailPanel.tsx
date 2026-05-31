export interface IpDetail {
  id: string;
  uri: string | null;
  parentCount: number;
  derivativeCount: number;
  royaltyPaidTotal: string;
  attachedTerms: { licenseTermsId: string }[];
  royaltyPayments: { token: string; amount: string; timestamp: string }[];
}

export function IpDetailPanel({ ip }: { ip: IpDetail }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 text-sm">
      <div className="font-mono text-xs break-all">{ip.id}</div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <div>Parents: {ip.parentCount}</div>
        <div>Derivatives: {ip.derivativeCount}</div>
        <div>Royalty: {ip.royaltyPaidTotal}</div>
      </div>
      <div className="mt-2">Attached terms: {ip.attachedTerms.map((t) => t.licenseTermsId).join(", ") || "—"}</div>
      <div className="mt-2">Royalty payments: {ip.royaltyPayments.length}</div>
    </div>
  );
}
