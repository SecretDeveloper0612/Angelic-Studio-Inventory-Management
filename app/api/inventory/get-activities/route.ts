import { NextResponse } from "next/server";
import { fetchRecentActivities } from "../../../../lib/googleSheets";

export async function GET() {
  try {
    const activities = await fetchRecentActivities();
    return NextResponse.json(activities);
  } catch (error) {
    console.error("API GET Activities Error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
