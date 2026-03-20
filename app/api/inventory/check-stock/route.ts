import { NextResponse } from "next/server";
import { fetchProductsFromSheet } from "../../../../lib/googleSheets";
import { sendLowStockNotification } from "../../../../lib/emailService";
import { Product } from "@/types/product";

export async function GET() {
  try {
    const products: Product[] = await fetchProductsFromSheet();
    const lowStockItems = products.filter(p => p.quantity <= p.minStock);

    for (const item of lowStockItems) {
      await sendLowStockNotification(item);
    }

    return NextResponse.json({
      message: "Check completed",
      lowStockCount: lowStockItems.length,
      triggeredAlerts: lowStockItems.map(p => p.name)
    });
  } catch (error) {
    console.error("API Stock Check Error:", error);
    return NextResponse.json({ error: "Failed to check stock" }, { status: 500 });
  }
}
