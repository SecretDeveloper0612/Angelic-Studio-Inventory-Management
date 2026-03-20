import { NextResponse } from "next/server";
import { initializeProductsSheet } from "@/lib/googleSheets";

export async function POST() {
  try {
    await initializeProductsSheet();
    return NextResponse.json({ success: true, message: "Sheet Restructured & Optimized" });
  } catch (error) {
    console.error("Fix Sheet Error:", error);
    return NextResponse.json({ error: "Failed to repair sheet" }, { status: 500 });
  }
}
