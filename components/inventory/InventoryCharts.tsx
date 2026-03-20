"use client";

import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
} from "recharts";

const COLORS = ["#c4a43c", "#d4b44c", "#e4c45c", "#f4d46c", "#a1832b", "#8a6d1f"];

interface UsageBarChartProps {
    data: { name: string; usage: number }[];
}

export const UsageBarChart: React.FC<UsageBarChartProps> = ({ data }) => (
  <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 h-[400px]">
    <h3 className="text-xl font-black text-slate-800 font-heading mb-8 uppercase tracking-widest leading-none">Product Usage Trend (Monthly)</h3>
    {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} />
            <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
            <Bar dataKey="usage" fill="#c4a43c" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
        </ResponsiveContainer>
    ) : (
        <div className="flex items-center justify-center h-full text-zinc-400 italic font-bold">No history recorded yet</div>
    )}
  </div>
);

interface CategoryPieChartProps {
    data: { name: string; value: number }[];
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => (
  <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 h-[400px]">
    <h3 className="text-xl font-black text-slate-800 font-heading mb-8 uppercase tracking-widest leading-none">Inventory Distribution (By Category)</h3>
    {data && data.length > 0 ? (
        <>
            <ResponsiveContainer width="100%" height="80%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip />
            </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
            {data.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        {entry.name} ({entry.value})
                    </span>
                </div>
            ))}
            </div>
        </>
    ) : (
        <div className="flex items-center justify-center h-full text-slate-400 italic">No data available</div>
    )}
  </div>
);
