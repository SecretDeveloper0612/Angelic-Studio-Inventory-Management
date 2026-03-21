"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { formatDate } from "@/utils/formatDate";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle,
  Edit2,
  Trash2,
  MinusCircle,
  PlusCircle,
  History,
  MoreVertical,
  UserPlus
} from "lucide-react";
import Image from "next/image";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

interface ProductTableProps {
  products: Product[];
  onDelete?: (id: string) => void;
  onUpdate?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onAssign?: (product: Product) => void;
}

const getStatusStyles = (quantity: number, minStock: number) => {
  if (quantity <= 0) return { 
    label: "Out", 
    color: "bg-red-50 text-red-600 border-red-100", 
    icon: <TrendingDown size={14} className="mr-1.5" /> 
  };
  if (quantity <= minStock) return { 
    label: "Low", 
    color: "bg-orange-50 text-orange-600 border-orange-100", 
    icon: <AlertCircle size={14} className="mr-1.5" /> 
  };
  return { 
    label: "In Stock", 
    color: "bg-emerald-50 text-emerald-600 border-emerald-100", 
    icon: <CheckCircle2 size={14} className="mr-1.5" /> 
  };
};

const ProductTable: React.FC<ProductTableProps> = ({ products, onDelete, onUpdate, onEdit, onAssign }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleAdjustQuantity = async (product: Product, delta: number) => {
    const newQuantity = Math.max(0, product.quantity + delta);
    if (newQuantity === product.quantity) return;

    setIsUpdating(product.id);
    const updatedProduct = { 
        ...product, 
        quantity: newQuantity,
        lastUpdated: new Date().toISOString()
    };

    try {
        const response = await fetch("/api/inventory/update-product", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
            onUpdate?.(updatedProduct);
            if (delta < 0) {
                toast.success(`Used 1 ${product.unit} of ${product.name}`);
            } else {
                toast.success(`Restocked ${product.name}`);
            }
        }
    } catch (error) {
        toast.error("Failed to sync inventory change");
    } finally {
        setIsUpdating(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="bg-white p-4 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-6 lg:space-y-0 text-black">
        <div className="flex items-center space-x-2">
            <h2 className="text-xl md:text-2xl font-black text-slate-800 font-heading leading-none uppercase tracking-tight">Product Catalog</h2>
            <span className="hidden sm:inline-block px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-widest leading-none">{filteredProducts.length} items found</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition font-bold"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto pl-12 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition font-black text-xs text-slate-600 uppercase tracking-widest"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE DATA (DESKTOP) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Product Information</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Storage</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Condition</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {filteredProducts.map((product, index) => {
              const status = getStatusStyles(product.quantity, product.minStock);
              const isItemUpdating = isUpdating === product.id;

              return (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={product.id} 
                  className="hover:bg-slate-50 transition group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-light flex-shrink-0 relative overflow-hidden flex items-center justify-center border border-primary-light shadow-sm">
                        {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        ) : (
                            <PackageIcon className="text-primary" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-black font-black tracking-tight leading-none mb-1">{product.name}</p>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none italic">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-primary-light text-primary-dark text-[10px] font-black rounded-full uppercase tracking-widest border border-primary-light shadow-sm leading-none">{product.category}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3 text-black">
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-lg font-black tracking-tighter leading-none mb-1",
                                product.quantity === 0 ? "text-red-600" : "text-black"
                            )}>
                                {product.quantity} 
                                <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">{product.unit}</span>
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition duration-300">
                            <button 
                                disabled={isItemUpdating || product.quantity <= 0}
                                onClick={() => handleAdjustQuantity(product, -1)}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition active:scale-90 disabled:opacity-20"
                            >
                                <MinusCircle size={18} />
                            </button>
                            <button 
                                disabled={isItemUpdating}
                                onClick={() => handleAdjustQuantity(product, 1)}
                                className="p-1 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition active:scale-90"
                            >
                                <PlusCircle size={18} />
                            </button>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn("px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm leading-none flex items-center w-fit", status.color)}>
                      {status.icon}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button 
                            onClick={() => onAssign?.(product)} 
                            title="Assign to Staff"
                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition duration-300 transform active:scale-95"
                        >
                            <UserPlus size={16} />
                        </button>
                        <button onClick={() => onEdit?.(product)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary-light rounded-xl transition duration-300 transform active:scale-95"><Edit2 size={16} /></button>
                        <button onClick={() => onDelete?.(product.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition duration-300 transform active:scale-95"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST VIEW */}
      <div className="md:hidden space-y-4">
        {filteredProducts.map((product) => {
            const status = getStatusStyles(product.quantity, product.minStock);
            const isItemUpdating = isUpdating === product.id;
            
            return (
                <div key={product.id} className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4 text-black">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm relative overflow-hidden">
                                {product.imageUrl ? (
                                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                ) : (
                                    <PackageIcon className="text-primary" size={20} />
                                )}
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 leading-none mb-1">{product.name}</h4>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{product.brand}</p>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <button onClick={() => onAssign?.(product)} className="p-2 text-emerald-500 bg-white rounded-xl border border-slate-100"><UserPlus size={16} /></button>
                            <button onClick={() => onEdit?.(product)} className="p-2 text-slate-400 bg-white rounded-xl border border-slate-100"><Edit2 size={16} /></button>
                            <button onClick={() => onDelete?.(product.id)} className="p-2 text-red-400 bg-white rounded-xl border border-slate-100"><Trash2 size={16} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-white p-3 rounded-2xl border border-slate-50 flex flex-col items-center">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1 leading-none">Quantity</span>
                            <div className="flex items-center space-x-3">
                                <button 
                                    disabled={isItemUpdating || product.quantity <= 0}
                                    onClick={() => handleAdjustQuantity(product, -1)}
                                    className="text-red-400 disabled:opacity-20"
                                >
                                    <MinusCircle size={20} />
                                </button>
                                <span className="text-xl font-black tracking-tighter leading-none">{product.quantity}</span>
                                <button 
                                    disabled={isItemUpdating}
                                    onClick={() => handleAdjustQuantity(product, 1)}
                                    className="text-emerald-400"
                                >
                                    <PlusCircle size={20} />
                                </button>
                            </div>
                        </div>
                        <div className={cn("p-3 rounded-2xl border flex flex-col items-center justify-center", status.color)}>
                            <span className="text-[8px] font-black opacity-50 uppercase tracking-widest mb-1 leading-none">Condition</span>
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none flex items-center">
                                {status.icon} {status.label}
                            </span>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};

// Internal icon for products
const PackageIcon = ({ className, size = 18 }: { className?: string; size?: number }) => (
    <div className={cn("w-10 h-10 flex items-center justify-center rounded-xl", className)}>
        <svg  width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
    </div>
);

export default ProductTable;
