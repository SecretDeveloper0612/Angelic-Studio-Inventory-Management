"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, X, Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  onClose, 
  onConfirm, 
  productName 
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40"
      />
      
      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="relative w-full max-w-md bg-white rounded-[40px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 will-change-transform"
      >
        {/* Header / Icon */}
        <div className="bg-red-50 p-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white rounded-[32px] shadow-2xl shadow-red-100/50 flex items-center justify-center mb-6 text-red-500">
            <AlertCircle size={48} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-3">
            Dangerous Action
          </h2>
          <p className="text-red-600/60 text-[10px] font-black uppercase tracking-[0.3em] italic">
            Permanent Registry Removal
          </p>
        </div>

        {/* Content */}
        <div className="p-10 text-center">
          <p className="text-slate-500 font-bold leading-relaxed mb-10 text-lg">
            Are you absolutely sure you want to delete <span className="text-slate-900 font-black italic">"{productName}"</span>?
          </p>

          <div className="flex flex-col space-y-4">
            <button
              onClick={onConfirm}
              className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-[24px] shadow-2xl shadow-red-200 transition-all active:scale-[0.97] flex items-center justify-center space-x-3 group"
            >
              <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
              <span>Confirm Deletion</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-6 bg-slate-50 hover:bg-slate-100 text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] rounded-[24px] transition-all active:scale-[0.97]"
            >
              Keep Product
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition duration-300"
        >
          <X size={24} />
        </button>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationModal;
