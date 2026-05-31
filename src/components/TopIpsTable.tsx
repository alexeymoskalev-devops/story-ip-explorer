import type { TopIp } from "../lib/transform";

export function TopIpsTable({ title, rows, metric }: { title: string; rows: TopIp[]; metric: "derivativeCount" | "royaltyPaidTotal" }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-gray-500"><th>IP</th><th>{metric === "derivativeCount" ? "Derivatives" : "Royalty paid"}</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-gray-100">
              <td className="truncate font-mono text-xs">{r.id}</td>
              <td>{metric === "derivativeCount" ? r.derivativeCount : r.royaltyPaidTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
