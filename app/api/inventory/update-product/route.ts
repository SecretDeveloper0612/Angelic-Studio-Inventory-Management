import { NextResponse } from "next/server";
import { updateProductInSheet } from "../../../../lib/googleSheets";
import { Product } from "@/types/product";

export async function PUT(request: Request) {
  try {
    const product: Product = await request.json();
    await updateProductInSheet(product);
    return NextResponse.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("API PUT Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
