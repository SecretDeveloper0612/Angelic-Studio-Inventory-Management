"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { Package, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { toast, Toaster } from "sonner";

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const success = await login(email, password);
        
        if (success) {
            toast.success("Identity verified! Welcome back.");
        } else {
            toast.error("Invalid credentials. Registry access denied.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 relative overflow-hidden">
            <Toaster richColors position="top-center" />
            
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light rounded-full blur-[100px] -mr-48 -mt-48 opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light rounded-full blur-[100px] -ml-48 -mb-48 opacity-30 animate-pulse"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white p-12 rounded-[40px] shadow-[0_32px_94px_-20px_rgba(0,0,0,0.08)] border border-slate-50 relative z-10"
            >
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-3xl shadow-xl shadow-primary-light flex items-center justify-center mb-8 transform -rotate-6">
                        <Package className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 font-heading tracking-tight leading-none mb-4 uppercase">
                        Studio Login
                    </h1>
                    <p className="text-slate-400 text-sm font-black uppercase tracking-widest leading-none italic flex items-center">
                        Access Angelic Beauty Registry <Sparkles size={14} className="ml-2 text-primary" />
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition" size={20} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Studio Email Address" 
                                className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary transition font-bold tracking-tight text-black"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-dark transition" size={20} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Secure Registry Key" 
                                className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-light focus:border-primary-dark transition font-bold tracking-tight text-black"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={isLoading}
                        type="submit"
                        className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all transform active:scale-[0.98] flex items-center justify-center group"
                    >
                        {isLoading ? "Verifying..." : "Initialize Dashboard"}
                        {!isLoading && <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition duration-300" />}
                    </button>
                    
                    <p className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">
                        Protected by Angelic Studio Controls v2.0
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
