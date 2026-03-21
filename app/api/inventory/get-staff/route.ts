import { NextResponse } from "next/server";
import { fetchStaffFromSheet } from "@/lib/googleSheets";

export async function GET() {
  try {
    const staff = await fetchStaffFromSheet();
    return NextResponse.json(staff);
  } catch (error) {
    console.error("API GET Staff Error:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}
