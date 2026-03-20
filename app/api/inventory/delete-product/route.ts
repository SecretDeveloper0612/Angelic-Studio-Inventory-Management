import { NextResponse } from "next/server";
import { deleteProductFromSheet } from "../../../../lib/googleSheets";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await deleteProductFromSheet(id);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("API DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
