import type { GraphEdge, GraphNode, NodeKind } from "@/lib/data";

const COLUMN: Record<NodeKind, number> = { agency: 0, official: 1, person: 1, contractor: 2, subcontractor: 3 };
const COLUMN_X = [100, 310, 520, 730];
const NODE_W = 176;
const NODE_H = 48;
const ROW = 88;
const WIDTH = 830;

const STYLE: Record<NodeKind, { fill: string; stroke: string; text: string; label: string }> = {
  agency: { fill: "#2e1a6b", stroke: "#2e1a6b", text: "#ffffff", label: "Agency" },
  official: { fill: "#ede8f8", stroke: "#c9bfe6", text: "#2e1a6b", label: "Official" },
  person: { fill: "#fbe7f1", stroke: "#eab2cf", text: "#8a1152", label: "Person" },
  contractor: { fill: "#ffffff", stroke: "#2e1a6b", text: "#1b1238", label: "Prime contractor" },
  subcontractor: { fill: "#ffffff", stroke: "#c9bfe6", text: "#1b1238", label: "Subcontractor" },
};

export function RelationshipGraph({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const columns = [0, 1, 2, 3].map((col) => nodes.filter((n) => COLUMN[n.kind] === col));
  const rows = Math.max(...columns.map((c) => c.length), 1);
  const height = rows * ROW + 24;

  const pos = new Map<string, { x: number; y: number }>();
  columns.forEach((col, ci) => {
    const offset = (height - col.length * ROW) / 2;
    col.forEach((n, i) => pos.set(n.id, { x: COLUMN_X[ci], y: offset + i * ROW + ROW / 2 }));
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <svg viewBox={`0 0 ${WIDTH} ${height}`} className="min-w-[760px]" role="img" aria-label="Relationship graph">
        {edges.map((edge) => {
          let a = nodes.find((n) => n.id === edge.from)!;
          let b = nodes.find((n) => n.id === edge.to)!;
          if (COLUMN[a.kind] > COLUMN[b.kind]) [a, b] = [b, a];
          const pa = pos.get(a.id)!;
          const pb = pos.get(b.id)!;
          const sameCol = COLUMN[a.kind] === COLUMN[b.kind];
          const x1 = sameCol ? pa.x : pa.x + NODE_W / 2;
          const x2 = sameCol ? pb.x : pb.x - NODE_W / 2;
          const y1 = sameCol ? pa.y + NODE_H / 2 : pa.y;
          const y2 = sameCol ? pb.y - NODE_H / 2 : pb.y;
          const mx = (x1 + x2) / 2;
          const d = sameCol ? `M ${x1} ${y1} L ${x2} ${y2}` : `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
          const color = edge.suspicious ? "#dc2626" : "#a79bd0";
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <path d={d} fill="none" stroke={color} strokeWidth={edge.suspicious ? 2 : 1.5} strokeDasharray={edge.suspicious ? "6 4" : undefined} />
              <text
                x={mx}
                y={(y1 + y2) / 2 - 6}
                textAnchor="middle"
                fontSize={11}
                fill={edge.suspicious ? "#b91c1c" : "#6b6485"}
                stroke="#f7f5fc"
                strokeWidth={4}
                style={{ paintOrder: "stroke" }}
              >
                {edge.label}
              </text>
            </g>
          );
        })}
        {nodes.map((n) => {
          const p = pos.get(n.id)!;
          const s = STYLE[n.kind];
          return (
            <g key={n.id} transform={`translate(${p.x - NODE_W / 2} ${p.y - NODE_H / 2})`}>
              <rect width={NODE_W} height={NODE_H} rx={12} fill={s.fill} stroke={s.stroke} strokeWidth={1.5} />
              <text x={NODE_W / 2} y={20} textAnchor="middle" fontSize={12} fontWeight={600} fill={s.text}>
                {n.label}
              </text>
              <text x={NODE_W / 2} y={36} textAnchor="middle" fontSize={10} fill={s.text} opacity={0.7}>
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
