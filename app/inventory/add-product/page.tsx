"use client";

import React from "react";
import AddProductForm from "@/components/inventory/AddProductForm";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

export default function AddProductPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 md:p-12">
      <Toaster position="top-right" richColors />
      <div className="max-w-[1600px] mx-auto">
        <AddProductForm 
            onCancel={() => router.push("/inventory/products")}
            onSuccess={() => router.push("/inventory/products")}
        />
      </div>
    </div>
  );
}
