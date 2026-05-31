"use client";
import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import type { CyElements } from "../lib/transform";

export function LineageGraph({ elements }: { elements: CyElements }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const cy = cytoscape({
      container: ref.current,
      elements: [...elements.nodes, ...elements.edges],
      style: [
        { selector: "node", style: { label: "data(label)", "font-size": "6px", width: 12, height: 12, "background-color": "#888" } },
        { selector: "node[?center]", style: { "background-color": "#2563eb", width: 18, height: 18 } },
        { selector: "edge", style: { "target-arrow-shape": "triangle", "curve-style": "bezier", width: 1, "line-color": "#bbb", "target-arrow-color": "#bbb" } },
      ] as cytoscape.StylesheetStyle[],
      layout: { name: "breadthfirst", directed: true } as cytoscape.LayoutOptions,
    });
    return () => cy.destroy();
  }, [elements]);
  return <div ref={ref} className="h-[420px] w-full rounded-lg border border-gray-200" />;
}
