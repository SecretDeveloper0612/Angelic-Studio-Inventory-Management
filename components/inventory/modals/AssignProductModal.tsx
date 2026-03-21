"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { motion } from "framer-motion";
import { 
  User, 
  Hash, 
  X, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface AssignProductModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: (updatedProduct: Product) => void;
}

const AssignProductModal: React.FC<AssignProductModalProps> = ({ 
  product, 
  onClose, 
  onSuccess 
}) => {
  const [staffMembers, setStaffMembers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    staffName: "",
    quantity: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStaff, setIsFetchingStaff] = useState(false);

  useEffect(() => {
    const loadStaff = async () => {
      setIsFetchingStaff(true);
      try {
        const res = await fetch("/api/inventory/get-staff");
        const data = await res.json();
        if (Array.isArray(data)) {
          setStaffMembers(data);
        }
      } catch (err) {
        console.error("Failed to load staff", err);
        setStaffMembers(["Sarah Johnson", "Michael Chen", "System Admin"]); // Fallback
      } finally {
        setIsFetchingStaff(false);
      }
    };
    loadStaff();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.staffName) {
      toast.error("Please select a staff member");
      return;
    }

    if (formData.quantity > product.quantity) {
      toast.error(`Insufficient stock! Only ${product.quantity} ${product.unit} available.`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/inventory/assign-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: formData.quantity,
          staffName: formData.staffName,
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        onSuccess(updatedProduct);
        toast.success(`Successfully assigned ${formData.quantity} ${product.unit} to ${formData.staffName}`);
        onClose();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to assign product");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="bg-white p-10 rounded-[48px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] border border-slate-100 relative max-w-md w-full overflow-hidden will-change-transform"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-dark shadow-sm"></div>
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">Assign Product</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">Inventory Distribution Control</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-[18px] transition duration-300 shadow-sm hover:shadow-red-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-10 p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-5 shadow-sm">
          <div className="w-16 h-16 rounded-[24px] bg-white shadow-xl flex items-center justify-center text-primary-dark font-black text-2xl border border-primary-light/30">
            {product.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 leading-snug mb-1 text-lg">{product.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{product.quantity} {product.unit} available</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Select Staff Specialist</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition" size={20} />
              <select 
                required
                className="w-full pl-14 pr-10 py-6 bg-slate-50 border border-slate-100 rounded-[28px] appearance-none focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition font-black text-slate-700 uppercase text-[11px] tracking-widest shadow-sm hover:border-slate-200"
                value={formData.staffName}
                onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
              >
                <option value="">{isFetchingStaff ? "Synchronizing Specialists..." : "Confirm Specialist Selection"}</option>
                {staffMembers.map(staff => (
                  <option key={staff} value={staff}>{staff.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Appoint Volume</label>
            <div className="relative group">
              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition" size={20} />
              <input 
                type="number" 
                min="1"
                max={product.quantity}
                required
                className="w-full pl-14 pr-4 py-6 bg-slate-50 border border-slate-100 rounded-[28px] focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition font-black text-2xl tracking-tighter shadow-sm hover:border-slate-200 text-slate-900"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.unit}</span>
            </div>
            {formData.quantity > product.quantity && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-2 ml-4">
                <AlertCircle size={14} /> Critical: Exceeds volume capacity
              </p>
            )}
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-6 border border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-widest rounded-[28px] hover:bg-slate-50 transition duration-300 active:scale-95"
            >
              Abort
            </button>
            <button
              disabled={isLoading || formData.quantity <= 0 || formData.quantity > product.quantity || !formData.staffName}
              type="submit"
              className="flex-[2] px-8 py-6 bg-slate-950 text-white font-extrabold uppercase text-[10px] tracking-[0.2em] rounded-[28px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] hover:bg-black transition-all duration-300 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.97]"
            >
              {isLoading ? "Synchronizing Storage..." : (
                <>
                  Confirm Assignment <CheckCircle2 size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AssignProductModal;
