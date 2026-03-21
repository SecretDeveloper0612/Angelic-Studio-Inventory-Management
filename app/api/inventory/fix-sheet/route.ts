import { NextResponse } from "next/server";
import { initializeProductsSheet, initializeStaffSheet } from "@/lib/googleSheets";

export async function POST() {
  try {
    await Promise.all([
        initializeProductsSheet(),
        initializeStaffSheet()
    ]);
    return NextResponse.json({ success: true, message: "Sheet Restructured & Staff Registry Added" });
  } catch (error) {
    console.error("Fix Sheet Error:", error);
    return NextResponse.json({ error: "Failed to repair sheet" }, { status: 500 });
  }
}
