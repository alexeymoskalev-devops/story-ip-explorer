import { describe, it, expect } from "vitest";
import { toOverviewMetrics, toTopIps, toLineageElements } from "../src/lib/transform";

describe("toOverviewMetrics", () => {
  it("counts entities and marks 1000 as capped", () => {
    const raw = {
      ipassets: Array.from({ length: 1000 }, (_, i) => ({ id: "0x" + i })),
      derivativeLinks: [{ id: "a" }, { id: "b" }],
      royaltyPayments: [{ id: "p", amount: "50" }, { id: "q", amount: "70" }],
    };
    const m = toOverviewMetrics(raw as any);
    expect(m.totalIp).toBe("1000+");
    expect(m.totalDerivatives).toBe("2");
    expect(m.totalRoyaltyPaid).toBe("120");
  });
});

describe("toTopIps", () => {
  it("maps the two ordered lists", () => {
    const raw = {
      byDerivatives: [{ id: "0xA", derivativeCount: 3, royaltyPaidTotal: "0" }],
      byRoyalty: [{ id: "0xB", royaltyPaidTotal: "99", derivativeCount: 1 }],
    };
    const t = toTopIps(raw as any);
    expect(t.byDerivatives[0]).toEqual({ id: "0xA", derivativeCount: 3, royaltyPaidTotal: "0" });
    expect(t.byRoyalty[0].royaltyPaidTotal).toBe("99");
  });
});

describe("toLineageElements", () => {
  it("builds center + parents + derivatives nodes and directed edges", () => {
    const ip = {
      id: "0xC",
      parents: [{ parent: { id: "0xP" }, licenseTermsIds: ["7"] }],
      derivatives: [{ child: { id: "0xD" } }],
    };
    const els = toLineageElements(ip as any);
    const ids = els.nodes.map((n) => n.data.id).sort();
    expect(ids).toEqual(["0xC", "0xD", "0xP"]);
    expect(els.nodes.find((n) => n.data.id === "0xC")!.data.center).toBe(true);
    expect(els.edges).toContainEqual({ data: { id: "0xP->0xC", source: "0xP", target: "0xC" } });
    expect(els.edges).toContainEqual({ data: { id: "0xC->0xD", source: "0xC", target: "0xD" } });
  });

  it("returns just the center node when no relations", () => {
    const els = toLineageElements({ id: "0xC", parents: [], derivatives: [] } as any);
    expect(els.nodes).toHaveLength(1);
    expect(els.edges).toHaveLength(0);
  });
});
