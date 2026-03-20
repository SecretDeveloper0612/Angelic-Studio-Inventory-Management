"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, Clock, Loader2, Package } from "lucide-react";
import { UsageBarChart, CategoryPieChart } from "@/components/inventory/InventoryCharts";
import { Toaster, toast } from "sonner";
import { Product } from "@/types/product";
import { RecentActivity } from "@/types/inventory";

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [productsRes, activitiesRes] = await Promise.all([
            fetch("/api/inventory/get-products"),
            fetch("/api/inventory/get-activities")
        ]);
        
        const productsData = await productsRes.json();
        const activitiesData = await activitiesRes.json();
        
        setProducts(productsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Reports Fetch Error:", error);
        toast.error("Failed to fetch analytical data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // 1. Stats Calculation
  const totalStockItems = products.reduce((sum, p) => sum + p.quantity, 0);
  
  // 2. Pie Chart Calculation
  const categories = products.reduce((acc: { [key: string]: number }, product) => {
    const cat = product.category || "General";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const pieChartData = Object.entries(categories).map(([name, value]) => ({ name, value }));

  // 3. Bar Chart Trend (Product Usage by Month)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const usageTrend = activities
    .filter(a => a.action === "usage")
    .reduce((acc: { [key: string]: number }, act) => {
      const monthIdx = new Date(act.date).getMonth();
      const month = monthNames[monthIdx];
      const details = act.details || "";
      const match = details.match(/(\d+)/);
      const val = match ? parseInt(match[0]) : 1;
      acc[month] = (acc[month] || 0) + val;
      return acc;
    }, {});

  const barChartData = monthNames.map(month => ({
    name: month,
    usage: usageTrend[month] || 0
  })).filter((m, i) => i <= new Date().getMonth());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Generating Real-Time Insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 md:p-12">
      <Toaster position="top-right" richColors />
      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 space-y-6 md:space-y-0 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-black text-slate-900 font-heading tracking-tight leading-none uppercase">
                Inventory Analytics
            </h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-none mt-4 italic">Business Grade Performance Reporting</p>
          </motion.div>
          <div className="flex space-x-4">
            <button 
                onClick={() => window.print()}
                className="flex items-center px-10 py-5 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95"
            >
                Print Official Audit
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Package size={80} />
                </div>
                <Package size={24} className="text-pink-500 mb-6" />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-4">Total Stock Volume</h3>
                <p className="text-4xl font-black text-slate-900 leading-none mb-2 tracking-tighter">
                   {totalStockItems} Items
                </p>
                <div className="flex items-center text-xs font-bold text-pink-500 tracking-tight leading-none italic uppercase">
                    Aggregated Studio Supply <Zap size={10} className="ml-1" />
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Target size={80} />
                </div>
                <Target size={24} className="text-indigo-500 mb-6" />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-4">Product Diversity</h3>
                <p className="text-4xl font-black text-slate-900 leading-none mb-2 tracking-tighter">
                   {products.length} SKU
                </p>
                <div className="flex items-center text-xs font-bold text-indigo-500 tracking-tight leading-none italic uppercase">
                    Unique Catalog Entries <Clock size={10} className="ml-1" />
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <TrendingUp size={80} />
                </div>
                <TrendingUp size={24} className="text-emerald-500 mb-6" />
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-4">Inventory Health</h3>
                <p className="text-4xl font-black text-slate-900 leading-none mb-2 tracking-tighter">100%</p>
                <div className="flex items-center text-xs font-bold text-emerald-500 tracking-tight leading-none italic uppercase">
                    Registry Synchronized
                </div>
            </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <CategoryPieChart data={pieChartData} />
        </div>
      </div>
    </div>
  );
}
