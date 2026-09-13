"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = { borderRadius: 12, border: "1px solid #e6e1f2", fontSize: 12, boxShadow: "0 4px 16px rgba(27,18,56,0.08)" };
const axis = { fontSize: 12, fill: "#6b6485" };

export function VariationTrendChart({ data }: { data: { month: string; flagged: number; verified: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="flagged" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b5176b" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#b5176b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="verified" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e1a6b" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#2e1a6b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eee9f7" vertical={false} />
          <XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false} />
          <YAxis tick={axis} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="flagged" name="Flagged" stroke="#b5176b" strokeWidth={2} fill="url(#flagged)" />
          <Area type="monotone" dataKey="verified" name="Verified" stroke="#2e1a6b" strokeWidth={2} fill="url(#verified)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const BAR_COLORS = ["#b5176b", "#0284c7", "#2e1a6b", "#d97706", "#7c3aed"];

export function DeviationTypeChart({ data }: { data: { type: string; count: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
          <CartesianGrid stroke="#eee9f7" horizontal={false} />
          <XAxis type="number" tick={axis} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="type" tick={axis} axisLine={false} tickLine={false} width={72} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f7f5fc" }} />
          <Bar dataKey="count" name="Flagged" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((d, i) => (
              <Cell key={d.type} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
