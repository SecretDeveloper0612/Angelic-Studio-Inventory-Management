"use client";

import React from "react";
import { RecentActivity } from "@/types/inventory";
import { formatDate } from "@/utils/formatDate";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  RotateCcw, 
  ArrowDownCircle, 
  Trash2, 
  RefreshCw 
} from "lucide-react";

const getActionIcon = (action: string) => {
  switch (action) {
    case "added": return <PlusCircle size={16} className="mr-2 text-green-500" />;
    case "usage": return <ArrowDownCircle size={16} className="mr-2 text-blue-500" />;
    case "refill": return <RotateCcw size={16} className="mr-2 text-purple-500" />;
    case "deleted": return <Trash2 size={16} className="mr-2 text-red-500" />;
    default: return <RefreshCw size={16} className="mr-2 text-slate-500" />;
  }
};

const RecentActivityTable: React.FC<{ activities: RecentActivity[] }> = ({ activities }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-800 font-heading tracking-tight leading-none uppercase">Recent Activity Registry</h2>
        <button className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-100 rounded-xl hover:bg-slate-50 transition">Export Log</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Product Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Action</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Date Logged</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Responsible Staff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={activity.id} 
                  className="hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 tracking-tight leading-none">{activity.productName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-bold tracking-tight text-slate-600 uppercase">
                      {getActionIcon(activity.action)}
                      {activity.action}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-400 tracking-tight leading-none italic">{formatDate(activity.date)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-pink-500 tracking-tight leading-none">{activity.staffName}</td>
                </motion.tr>
              ))
            ) : (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No activity recorded recently</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityTable;
