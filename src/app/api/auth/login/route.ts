import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SECONDME_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/callback`;

  // 构造 SecondMe OAuth 授权 URL
  const oauthUrl = new URL("https://go.second.me/oauth/");
  oauthUrl.searchParams.set("client_id", clientId || "");
  oauthUrl.searchParams.set("redirect_uri", redirectUri);
  oauthUrl.searchParams.set("response_type", "code");
  oauthUrl.searchParams.set("scope", "user_info shades chat");

  return NextResponse.redirect(oauthUrl.toString());
}
