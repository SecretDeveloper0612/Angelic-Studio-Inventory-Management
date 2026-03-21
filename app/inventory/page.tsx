"use client";

import React, { useEffect, useState } from "react";
import DashboardStats from "@/components/inventory/DashboardStats";
import RecentActivityTable from "@/components/inventory/RecentActivityTable";
import { UsageBarChart, CategoryPieChart } from "@/components/inventory/InventoryCharts";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutDashboard, RefreshCw, Users, ShieldAlert } from "lucide-react";
import { RecentActivity } from "@/types/inventory";
import { Product } from "@/types/product";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

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

  const runAudit = async () => {
    setIsAuditing(true);
    try {
        const res = await fetch("/api/inventory/check-stock");
        const data = await res.json();
        if (data.lowStockCount > 0) {
            toast.success(`Security Audit Complete: ${data.lowStockCount} alerts dispatched to manager.`);
        } else {
            toast.success("Security Audit Complete: All stock levels are optimal.");
        }
    } catch (err) {
        toast.error("Security Audit Failed. Check network connection.");
    } finally {
        setIsAuditing(false);
    }
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

  // 3. Staff Activity Distribution
  const staffActivity = activities.reduce((acc: { [key: string]: number }, act) => {
    if (act.staffName && act.staffName !== "System Auto") {
      acc[act.staffName] = (acc[act.staffName] || 0) + 1;
    }
    return acc;
  }, {});
  const staffData = Object.entries(staffActivity).sort((a, b) => b[1] - a[1]);

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
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto"
          >
            <button 
                disabled={isAuditing || isLoading}
                onClick={runAudit}
                className="flex items-center justify-center px-8 py-5 bg-white border border-slate-100 text-slate-600 font-black uppercase text-xs tracking-widest rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
                <ShieldAlert size={16} className={cn("mr-2", isAuditing && "animate-spin text-red-500")} />
                {isAuditing ? "Auditing..." : "Audit & Notify"}
            </button>
            <button 
                disabled={isRefreshing || isLoading}
                onClick={refreshData}
                className="flex items-center justify-center px-8 py-5 bg-gradient-to-r from-primary to-primary-dark text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg hover:shadow-primary-light transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
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

        {/* Staff Assignment Overview */}
        <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-pink-50 rounded-xl">
                    <Users size={20} className="text-pink-500" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">Staff Performance Hub</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live assignment metrics per specialist</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {staffData.length > 0 ? staffData.map(([name, count], index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={name}
                        className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm flex items-center justify-between hover:shadow-md transition group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-pink-500 font-black group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
                                {name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 leading-none">{name}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Active Specialist</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-slate-900 group-hover:text-pink-500 transition-colors">{count}</span>
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Tasks</p>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-12 bg-white rounded-[32px] border border-dashed border-slate-200 text-center">
                        <p className="text-slate-400 text-sm font-bold italic">Assign products in the Registry to see staff performance metrics here.</p>
                    </div>
                )}
            </div>
        </section>

        {/* Live Registry Activity */}
        <RecentActivityTable activities={activities} />
      </div>
    </div>
  );
}
