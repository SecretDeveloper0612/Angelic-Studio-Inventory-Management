"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  colorClass: string;
  indicatorColor: string;
}

const StatCard: React.FC<StatProps> = ({ title, count, icon, colorClass, indicatorColor }) => (
  <motion.div 
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="relative overflow-hidden bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 transition-all duration-300"
  >
    <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full", indicatorColor)}></div>
    <div className="flex items-center space-x-4">
      <div className={cn("p-4 rounded-2xl", colorClass)}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-slate-800 font-heading">{count}</h3>
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs font-bold text-slate-400 group cursor-pointer hover:text-slate-600 transition">
        View Detailed Report <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition duration-300" />
    </div>
  </motion.div>
);

interface DashboardStatsProps {
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    recentUpdatesCount: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
    totalProducts, 
    lowStockCount, 
    outOfStockCount, 
    recentUpdatesCount 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      <StatCard 
        title="Total Products" 
        count={totalProducts} 
        icon={<Package size={24} className="text-primary-dark" />} 
        colorClass="bg-primary-light"
        indicatorColor="bg-primary"
      />
      <StatCard 
        title="Low Stock" 
        count={lowStockCount} 
        icon={<AlertTriangle size={24} className="text-orange-500" />} 
        colorClass="bg-orange-50"
        indicatorColor="bg-orange-500"
      />
      <StatCard 
        title="Out of Stock" 
        count={outOfStockCount} 
        icon={<TrendingDown size={24} className="text-red-600" />} 
        colorClass="bg-red-50"
        indicatorColor="bg-red-500"
      />
      <StatCard 
        title="Recent Updates" 
        count={recentUpdatesCount} 
        icon={<Clock size={24} className="text-purple-600" />} 
        colorClass="bg-purple-50"
        indicatorColor="bg-purple-500"
      />
    </div>
  );
};

export default DashboardStats;
