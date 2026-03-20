"use client";

import React, { useState, useEffect } from "react";
import { Product, UnitType } from "@/types/product";
import { generateId } from "@/utils/generateId";
import { motion } from "framer-motion";
import { 
  Package, 
  Tag, 
  Layers, 
  ArrowRight, 
  X, 
  Save,
  Wand2
} from "lucide-react";
import { toast } from "sonner";

interface AddProductFormProps {
  initialData?: Product;
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    brand: initialData?.brand || "",
    quantity: initialData?.quantity || 0,
    minStock: initialData?.minStock || 5,
    unit: (initialData?.unit as UnitType) || "pcs",
    imageUrl: initialData?.imageUrl || "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setIsLoading(true);
    
    const productData: Product = {
      ...formData,
      supplier: initialData?.supplier || "", 
      purchasePrice: 0,
      sellingPrice: 0,
      id: initialData?.id || generateId(),
      lastUpdated: new Date().toISOString(),
    };

    try {
      const endpoint = isEditing ? "/api/inventory/update-product" : "/api/inventory/add-product";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        onSuccess?.(productData);
        toast.success(isEditing ? "Registry entry updated successfully!" : "Product successfully added to catalog!");
      } else {
        throw new Error("API responded with error");
      }
    } catch (error) {
        console.error("Form Submit Error:", error);
        toast.error("Critical error saving product. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-[40px] shadow-[0_32px_94px_-20px_rgba(0,0,0,0.1)] border border-slate-50 relative max-w-3xl w-full mx-auto overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-primary-dark"></div>
      <div className="flex justify-between items-center mb-10 pl-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 font-heading leading-tight uppercase tracking-tight flex items-center">
            {isEditing ? "Modify Registry Entry" : "Create New Entry"}
            <Wand2 className="ml-3 text-primary" size={24} />
          </h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-none mt-2 italic">Official Studio Inventory Control</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition duration-300"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="pl-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase leading-none border-b border-slate-50 pb-2 flex items-center">
                Main Identification
            </h3>
            <div className="space-y-4">
              <div className="relative group">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="Product Title" 
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition placeholder:text-slate-400 text-black font-bold tracking-tight"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition" size={18} />
                <select 
                  required
                  className="w-full pl-12 pr-10 py-5 bg-slate-50 border border-slate-100 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition font-black tracking-tight text-slate-600 uppercase text-xs"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Category Selection</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Hair Care">Hair Care</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Treatments">Treatments</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
              <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition" size={18} />
                <input 
                  type="text" 
                  placeholder="Brand / Manufacturer" 
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition placeholder:text-slate-400 text-black font-bold tracking-tight"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase leading-none border-b border-slate-50 pb-2 flex items-center">
                Storage & Volume
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-4 top-2 text-[8px] font-black text-slate-300 uppercase">Current Stock</span>
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    className="w-full px-4 pt-6 pb-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition text-black font-black text-lg tracking-tighter"
                    value={formData.quantity || ""}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-[8px] font-black text-slate-300 uppercase">Alert Level</span>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-full px-4 pt-6 pb-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition text-black font-black text-lg tracking-tighter"
                    value={formData.minStock || ""}
                    onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="relative group">
                <select 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition font-black tracking-tight text-slate-600 uppercase text-xs"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as UnitType })}
                >
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="bottles">Bottles</option>
                  <option value="sets">Sets</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8 space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-5 text-slate-400 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-50 transition duration-300"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            type="submit"
            className="px-12 py-5 bg-slate-950 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-black transition-all duration-300 transform active:scale-95 flex items-center group"
          >
            {isLoading ? "Synchronizing..." : isEditing ? "Save Changes" : "Register Product"}
            {!isLoading && (isEditing ? <Save size={18} className="ml-3" /> : <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition duration-300" />)}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProductForm;
