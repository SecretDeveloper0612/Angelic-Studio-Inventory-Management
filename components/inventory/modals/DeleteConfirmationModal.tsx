"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header / Icon */}
            <div className="bg-red-50 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-red-100 flex items-center justify-center mb-6 text-red-500">
                <AlertCircle size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">
                Dangerous Action
              </h2>
              <p className="text-red-500/60 text-[10px] font-black uppercase tracking-[0.2em] italic">
                Permanent Registry Removal
              </p>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <p className="text-slate-500 font-bold leading-relaxed mb-8">
                Are you absolutely sure you want to delete <span className="text-slate-900 font-black italic">"{productName}"</span>? This action cannot be undone and will erase all associated logs.
              </p>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={onConfirm}
                  className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center space-x-3"
                >
                  <Trash2 size={16} />
                  <span>Confirm Deletion</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-slate-50 hover:bg-slate-100 text-slate-400 font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all"
                >
                  Keep Product
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
