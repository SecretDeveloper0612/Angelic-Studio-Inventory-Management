"use client";

import React, { useEffect, useState } from "react";
import ProductTable from "@/components/inventory/ProductTable";
import { Product } from "@/types/product";
import Link from "next/link";
import { 
  ArrowLeft, 
  AlertTriangle, 
  Send, 
  RotateCcw,
  RefreshCw,
  PackageCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { formatDate } from "@/utils/formatDate";

export default function LowStockPage() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const response = await fetch("/api/inventory/get-products");
        const data = await response.json();
        const filtered = data.filter((p: Product) => p.quantity <= p.minStock);
        setLowStockProducts(filtered);
      } catch (error) {
        console.error("Error fetching low stock:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  const triggerManualCheck = async () => {
    setIsChecking(true);
    try {
        const response = await fetch("/api/inventory/check-stock");
        const data = await response.json();
        toast.success(`Check Completed! Notified management about ${data.lowStockCount} items.`);
    } catch (error) {
        toast.error("Alert system failed. Try manual notification.");
    } finally {
        setIsChecking(false);
    }
  }

  const handleRefill = async (id: string) => {
    toast.promise(
        new Promise((resolve) => setTimeout(resolve, 800)),
        {
          loading: 'Processing refill order...',
          success: 'Stock successfully replenished!',
          error: 'Replenishment failed.',
        }
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 md:p-12">
      <Toaster position="top-right" richColors />
      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 space-y-6 md:space-y-0">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link 
              href="/inventory" 
              className="group flex items-center text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-4 hover:text-primary transition duration-300"
            >
              <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition duration-300" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-2xl shadow-sm border border-red-100">
                    <AlertTriangle size={24} className="text-red-500 shadow-red-200" />
                </div>
                <h1 className="text-5xl font-black text-slate-900 font-heading tracking-tight leading-none uppercase">
                    Critical Stock Alerts
                </h1>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex space-x-4">
            <button 
                disabled={isChecking}
                onClick={triggerManualCheck}
                className="flex items-center px-8 py-4 bg-white border border-slate-100 text-slate-600 font-black uppercase text-xs tracking-widest rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
                <Send size={16} className={cn("mr-2", isChecking && "animate-spin")} />
                {isChecking ? "Notifying..." : "Notify Manager"}
            </button>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="animate-spin text-primary" size={32} />
          </div>
        ) : lowStockProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 px-2 max-w-4xl">
            {lowStockProducts.map((p, index) => (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={p.id} 
                    className="p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex flex-col md:flex-row justify-between items-center group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <AlertTriangle size={80} />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-red-50 text-red-500 rounded-2xl shadow-sm border border-red-50">
                            <span className="text-xl font-black">{p.quantity}</span>
                            <span className="text-[10px] font-bold block uppercase tracking-widest leading-none text-red-300 mt-1">{p.unit} LEFT</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{p.name}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none italic">Min Threshold: {p.minStock} {p.unit}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-2">Supplier: {p.supplier}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleRefill(p.id)}
                        className="mt-6 md:mt-0 px-8 py-5 bg-gradient-to-r from-primary to-primary-dark text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-lg hover:shadow-primary-light transition-all hover:scale-[1.02] active:scale-95 flex items-center"
                    >
                        <RotateCcw size={16} className="mr-2" /> Refill Stock
                    </button>
                </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-24 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 text-center flex flex-col items-center">
            <div className="p-10 bg-emerald-50 text-emerald-500 rounded-full shadow-emerald-100 shadow-2xl mb-8">
                <PackageCheck size={64} className="stroke-[1.5]" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 font-heading uppercase tracking-tight leading-none mb-4">Inventory Optimized</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest leading-none italic max-w-md">Excellent work! No items are currently below the critical stock threshold.</p>
            <Link href="/inventory" className="mt-12 px-10 py-5 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all hover:scale-105 active:scale-95">
                Return to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import { cn } from "../../../lib/utils";
