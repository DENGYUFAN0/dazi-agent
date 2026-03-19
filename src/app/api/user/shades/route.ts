import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("secondme_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "未登录", shades: [] }, { status: 401 });
  }

  try {
    const res = await fetch("https://app.mindos.com/gate/lab/api/secondme/user/shades", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "获取兴趣标签失败", shades: [] }, { status: res.status });
    }

    const data = await res.json();
    
    // SecondMe shades API 返回用户兴趣标签
    // 格式可能是 { shades: [...] } 或 { data: { shades: [...] } }
    const shades = data.shades || data.data?.shades || [];
    
    return NextResponse.json({ shades });
  } catch (error) {
    console.error("Fetch shades error:", error);
    return NextResponse.json({ error: "服务器错误", shades: [] }, { status: 500 });
  }
}
