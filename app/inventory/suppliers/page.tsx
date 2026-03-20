"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, Plus, MoreVertical, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner";

const MOCK_SUPPLIERS = [
  { id: "1", name: "L'Oréal Professionnel", contact: "+33 1 47 56 70 00", email: "orders@loreal.com", address: "Clichy, France", lastOrder: "2024-03-15" },
  { id: "2", name: "Estée Lauder Cos.", contact: "+1 212-572-4200", email: "support@estee.com", address: "New York, USA", lastOrder: "2024-03-18" },
];

export default function SuppliersPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 md:p-12">
      <Toaster position="top-right" richColors />
      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 space-y-6 md:space-y-0">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-black text-slate-900 font-heading tracking-tight leading-none uppercase">
                Supplier Registry
            </h1>
          </motion.div>
          <button className="flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg hover:shadow-pink-200 transition-all hover:scale-[1.02] active:scale-95">
                <Plus size={18} className="mr-2" /> Add Partner Supplier
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_SUPPLIERS.map((s, index) => (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={s.id} 
                    className="p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 relative group"
                >
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button className="p-2 text-slate-400 hover:text-pink-500 transition"><MoreVertical size={20} /></button>
                    </div>
                    <div className="w-16 h-16 bg-pink-50 rounded-2xl mb-6 flex items-center justify-center p-3">
                        <Truck className="text-pink-500" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 leading-none mb-6">{s.name}</h3>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center text-sm font-bold text-slate-500 tracking-tight leading-none">
                            <Phone size={14} className="mr-3 text-pink-400" /> {s.contact}
                        </div>
                        <div className="flex items-center text-sm font-bold text-slate-500 tracking-tight leading-none">
                            <Mail size={14} className="mr-3 text-pink-400" /> {s.email}
                        </div>
                        <div className="flex items-center text-sm font-bold text-slate-500 tracking-tight leading-none">
                            <MapPin size={14} className="mr-3 text-pink-400" /> {s.address}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Last Dispatch: <span className="text-slate-800">{s.lastOrder}</span></p>
                        <button className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-none hover:underline underline-offset-4">Order History</button>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
