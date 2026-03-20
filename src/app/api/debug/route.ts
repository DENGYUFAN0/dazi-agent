import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SECONDME_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dazi-agent.zeabur.app";
  const redirectUri = `${baseUrl}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "user_info shades chat",
  });

  const oauthUrl = `https://go.second.me/oauth/?${params.toString()}`;

  return NextResponse.json({
    oauthUrl: oauthUrl,
    clientId: clientId ? clientId.substring(0, 8) + "..." : "缺失",
    redirectUri: redirectUri,
  });
}