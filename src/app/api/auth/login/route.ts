import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.SECONDME_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dazi-agent.zeabur.app";
  const redirectUri = `${baseUrl}/api/auth/callback`;

  if (!clientId) {
    return new NextResponse(
      JSON.stringify({ error: "SECONDME_CLIENT_ID 环境变量未设置" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "user_info shades chat",
  });

  const oauthUrl = `https://go.second.me/oauth/?${params.toString()}`;

  return NextResponse.redirect(oauthUrl);
}