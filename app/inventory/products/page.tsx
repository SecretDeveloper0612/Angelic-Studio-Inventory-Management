"use client";

import React, { useEffect, useState } from "react";
import ProductTable from "@/components/inventory/ProductTable";
import { Product } from "@/types/product";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  List, 
  Download, 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import AddProductForm from "@/components/inventory/AddProductForm";
import DeleteConfirmationModal from "@/components/inventory/modals/DeleteConfirmationModal";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory/get-products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const initiateDelete = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setProductToDelete(product);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch("/api/inventory/delete-product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productToDelete.id }),
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productToDelete.id));
        toast.success("Product permanently removed from database");
      }
    } catch (error) {
      toast.error("Database deletion failed. Synchronize and retry.");
    } finally {
      setProductToDelete(null);
    }
  };

  const handleUpdate = (updatedProduct: Product) => {
    const exists = products.find(p => p.id === updatedProduct.id);
    if (exists) {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } else {
        setProducts([updatedProduct, ...products]);
    }
    setShowAddForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-8 md:p-12">
      <Toaster position="top-right" richColors />
      <div className="max-w-[1600px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 space-y-6 md:space-y-0 text-black">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link 
              href="/inventory" 
              className="group flex items-center text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-4 hover:text-primary transition duration-300"
            >
              <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition duration-300" /> Back to Studio Dashboard
            </Link>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <List size={24} className="text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight leading-none uppercase">
                    Product Registry
                </h1>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto"
          >
            <button className="flex items-center justify-center px-6 py-5 bg-white border border-slate-100 text-slate-600 font-black uppercase text-xs tracking-widest rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95">
                <Download size={16} className="mr-2" /> Export Inventory
            </button>
            <button 
                onClick={() => {
                    setEditingProduct(null);
                    setShowAddForm(true);
                }}
                className="flex items-center justify-center px-8 py-5 bg-gradient-to-r from-primary to-primary-dark text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg hover:shadow-primary-light transition-all hover:scale-[1.02] active:scale-95"
            >
                <Plus size={18} className="mr-2" /> Register New Entry
            </button>
          </motion.div>
        </header>

        <AnimatePresence>
            {(showAddForm || editingProduct) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <AddProductForm 
                        initialData={editingProduct || undefined}
                        onCancel={() => {
                            setShowAddForm(false);
                            setEditingProduct(null);
                        }} 
                        onSuccess={handleUpdate} 
                    />
                </div>
            )}
        </AnimatePresence>

        {/* CUSTOM DELETE MODAL */}
        <DeleteConfirmationModal 
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
          productName={productToDelete?.name || ""}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 opacity-50">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-white rounded-3xl animate-pulse shadow-sm border border-slate-50"></div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ProductTable 
                products={products} 
                onDelete={initiateDelete} 
                onUpdate={handleUpdate}
                onEdit={(p) => setEditingProduct(p)}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
