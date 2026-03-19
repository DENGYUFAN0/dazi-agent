import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  try {
    // 用 authorization code 换取 access token
    const tokenRes = await fetch("https://app.mindos.com/gate/lab/api/oauth/token/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: process.env.SECONDME_CLIENT_ID || "",
        client_secret: process.env.SECONDME_CLIENT_SECRET || "",
        redirect_uri: `${baseUrl}/api/auth/callback`,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.redirect(`${baseUrl}/?error=token_failed`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    // 将 token 存储在 httpOnly cookie 中
    const cookieStore = await cookies();
    cookieStore.set("secondme_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60, // 2 小时
      path: "/",
    });

    if (refreshToken) {
      cookieStore.set("secondme_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 天
        path: "/",
      });
    }

    // 登录成功，跳转到兴趣选择页
    return NextResponse.redirect(`${baseUrl}/register`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(`${baseUrl}/?error=callback_failed`);
  }
}
