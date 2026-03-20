import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasClientId: !!process.env.SECONDME_CLIENT_ID,
    hasClientSecret: !!process.env.SECONDME_CLIENT_SECRET,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "未设置",
    nodeEnv: process.env.NODE_ENV,
  });
}