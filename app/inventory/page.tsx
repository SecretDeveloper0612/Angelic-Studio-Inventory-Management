"use client";

import React, { useEffect, useState } from "react";
import DashboardStats from "@/components/inventory/DashboardStats";
import RecentActivityTable from "@/components/inventory/RecentActivityTable";
import { UsageBarChart, CategoryPieChart } from "@/components/inventory/InventoryCharts";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutDashboard, RefreshCw } from "lucide-react";
import { RecentActivity } from "@/types/inventory";
import { Product } from "@/types/product";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
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
      console.error("Dashboard Fetch Error:", error);
      toast.error("Failed to fetch live studio data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast.success("Synchronized with Google Registry");
  }

  // Calculate Real-Time Data
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length;
  const outOfStockCount = products.filter(p => p.quantity <= 0).length;
  
  // 1. Pie Chart Calculation
  const categories = products.reduce((acc: { [key: string]: number }, product) => {
    const cat = product.category || "General";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const pieChartData = Object.entries(categories).map(([name, value]) => ({ name, value }));

  // 2. Bar Chart Trend (Product Usage by Month)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const usageTrend = activities
    .filter(a => a.action === "usage")
    .reduce((acc: { [key: string]: number }, act) => {
      const monthIdx = new Date(act.date).getMonth();
      const month = monthNames[monthIdx];
      
      // Extract numeric value from details like "1 bottles recorded"
      const details = act.details || "";
      const match = details.match(/(\d+)/);
      const val = match ? parseInt(match[0]) : 1;
      
      acc[month] = (acc[month] || 0) + val;
      return acc;
    }, {});

  const barChartData = monthNames.map(month => ({
    name: month,
    usage: usageTrend[month] || 0
  })).filter((m, i) => i <= new Date().getMonth()); // Current year so far

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-8 md:p-12">
      <Toaster position="top-right" richColors />
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 space-y-6 md:space-y-0 relative">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-light rounded-xl">
                    <LayoutDashboard size={20} className="text-primary" />
                </div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none italic">Angelic Beauty & Wellness Studio Controls</h2>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight flex flex-wrap items-center leading-tight">
                Inventory Dashboard <Sparkles className="ml-2 sm:ml-4 text-primary animate-pulse w-6 h-6 sm:w-8 sm:h-8" />
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex w-full md:w-auto"
          >
            <button 
                disabled={isRefreshing || isLoading}
                onClick={refreshData}
                className="w-full md:w-auto flex items-center justify-center px-8 py-5 bg-gradient-to-r from-primary to-primary-dark text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg hover:shadow-primary-light transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
                <RefreshCw size={16} className={cn("mr-2", isRefreshing && "animate-spin")} />
                {isRefreshing ? "Synchronizing..." : "Sync Database"}
            </button>
          </motion.div>
        </header>

        {/* Live Stats */}
        <DashboardStats 
            totalProducts={totalProducts}
            lowStockCount={lowStockCount}
            outOfStockCount={outOfStockCount}
            recentUpdatesCount={activities.length}
        />

        {/* Live Charts */}
        <div className="mb-12">
            <CategoryPieChart data={pieChartData} />
        </div>

        {/* Live Registry Activity */}
        <RecentActivityTable activities={activities} />
      </div>
    </div>
  );
}
