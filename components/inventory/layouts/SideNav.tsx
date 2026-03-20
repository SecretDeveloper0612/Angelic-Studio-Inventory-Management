"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  Truck, 
  BarChart3, 
  LogOut, 
  PlusCircle,
  Menu,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

import { useAuth } from "@/lib/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/inventory", icon: LayoutDashboard },
  { label: "Products", href: "/inventory/products", icon: Package },
  { label: "Low Stock", href: "/inventory/low-stock", icon: AlertTriangle },
  { label: "Reports", href: "/inventory/reports", icon: BarChart3 },
];

const SideNav: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-[60] p-4 bg-white rounded-2xl shadow-xl border border-slate-50 md:hidden lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-50 transition-transform duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.02)]",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 md:translate-x-0"
      )}>
        <div className="flex flex-col h-full p-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg shadow-primary-light flex items-center justify-center p-2">
                <Package className="text-white" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-black text-slate-900 font-heading leading-tight uppercase tracking-tight">Angelic</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Studio Registry</p>
            </div>
          </div>

          <nav className="flex-1 space-y-3">
            {NAV_ITEMS.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center px-6 py-4 rounded-2xl transition duration-300 group relative",
                    active ? "bg-slate-950 text-white shadow-xl shadow-slate-100" : "text-slate-400 hover:bg-primary-light hover:text-primary-dark"
                  )}>
                    {active && (
                        <motion.div 
                            layoutId="activeNav" 
                            className="absolute inset-0 bg-slate-950 rounded-2xl" 
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <item.icon size={20} className={cn("relative z-10 mr-4", active ? "text-white" : "group-hover:text-primary-dark")} />
                    <span className="relative z-10 text-xs font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <Link href="/inventory/add-product" className="mb-4">
            <div className="flex items-center justify-center w-full px-6 py-5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl shadow-lg shadow-primary-light hover:scale-[1.02] transition duration-300 transform active:scale-95 space-x-3">
                <PlusCircle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Quick Register</span>
            </div>
          </Link>

          <footer className="mt-auto pt-10 border-t border-slate-50">
            <div className="p-6 bg-slate-50 rounded-2xl mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 italic">Active Station</p>
                <p className="text-sm font-bold text-slate-800 leading-none">Studio Admin Portal</p>
            </div>
            <button 
                onClick={logout}
                className="flex items-center px-6 py-4 text-slate-400 hover:text-red-500 transition duration-300 group"
            >
                <LogOut size={20} className="mr-4 group-hover:-translate-x-1 transition duration-300" />
                <span className="text-xs font-black uppercase tracking-widest leading-none">Sign Out Registry</span>
            </button>
          </footer>
        </div>
      </div>

      {isOpen && (
        <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm lg:hidden md:hidden"
        />
      )}
    </>
  );
};

export default SideNav;
