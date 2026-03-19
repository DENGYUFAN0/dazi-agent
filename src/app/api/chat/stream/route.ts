import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("secondme_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "未登录", reply: "" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "消息不能为空", reply: "" }, { status: 400 });
    }

    // 调用 SecondMe 聊天 API（SSE 流式）
    const res = await fetch("https://app.mindos.com/gate/lab/api/secondme/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Chat API error:", errorText);
      return NextResponse.json({ error: "聊天 API 调用失败", reply: "" }, { status: res.status });
    }

    // 处理 SSE 流式响应，收集完整回复
    const text = await res.text();
    let fullReply = "";

    // SSE 格式解析: data: {...}\n\n
    const lines = text.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.content) {
            fullReply += data.content;
          } else if (data.text) {
            fullReply += data.text;
          } else if (data.message) {
            fullReply += data.message;
          }
        } catch {
          // 非 JSON 数据行，可能是普通文本
          const content = line.slice(6).trim();
          if (content && content !== "[DONE]") {
            fullReply += content;
          }
        }
      }
    }

    // 如果流式解析没拿到内容，尝试直接用整个文本
    if (!fullReply) {
      try {
        const jsonData = JSON.parse(text);
        fullReply = jsonData.content || jsonData.reply || jsonData.message || jsonData.text || "";
      } catch {
        fullReply = text.trim();
      }
    }

    return NextResponse.json({ reply: fullReply || "AI 分身正在思考中..." });
  } catch (error) {
    console.error("Chat stream error:", error);
    return NextResponse.json({ error: "服务器错误", reply: "" }, { status: 500 });
  }
}
