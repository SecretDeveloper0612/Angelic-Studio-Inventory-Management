import { NextResponse } from "next/server";
import { updateUsageInSheet } from "@/lib/googleSheets";

export async function POST(request: Request) {
  try {
    const { productId, quantity, staffName } = await request.json();

    if (!productId || !quantity || !staffName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedProduct = await updateUsageInSheet(productId, parseInt(quantity), staffName);
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Assign product error:", error);
    return NextResponse.json({ error: error.message || "Failed to assign product" }, { status: 500 });
  }
}
