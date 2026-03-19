import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("secondme_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const res = await fetch("https://app.mindos.com/gate/lab/api/secondme/user/info", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "获取用户信息失败" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch user info error:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
