"use client";

import React from "react";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import LoginPage from "@/components/inventory/LoginPage";
import SideNav from "@/components/inventory/layouts/SideNav";
import { cn } from "@/lib/utils";

const AuthContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin mb-4 shadow-xl"></div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] italic">Loading Registry...</p>
        </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-full flex flex-col lg:flex-row bg-[#F9FAFB] font-sans">
      <SideNav />
      <main className="flex-1 lg:ml-80 w-full min-h-screen relative z-10 transition-all duration-500 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  );
};

export default AuthWrapper;
