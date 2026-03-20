import { NextResponse } from "next/server";
import { addProductToSheet } from "../../../../lib/googleSheets";
import { Product } from "@/types/product";

export async function POST(request: Request) {
  try {
    const product: Product = await request.json();
    await addProductToSheet(product);
    return NextResponse.json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
