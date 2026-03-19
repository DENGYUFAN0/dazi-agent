"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { generateA2AConversation, ChatMessage } from "@/lib/a2aSimulator";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const allMessagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("dazi_current_match");
    if (!stored) {
      router.push("/match");
      return;
    }

    const match = JSON.parse(stored);
    setMatchInfo(match);

    // 生成 A2A 对话
    const conversation = generateA2AConversation(
      match.commonInterests,
      "我的分身",
      match.user.name
    );
    allMessagesRef.current = conversation;
    setMessages(conversation);

    // 逐条显示消息（模拟流式效果）
    let count = 0;
    const showNext = () => {
      if (count < conversation.length) {
        count++;
        setVisibleCount(count);
        
        // 最后一条消息用流式效果
        if (count === conversation.length) {
          setStreaming(true);
          const lastMsg = conversation[conversation.length - 1];
          let charIdx = 0;
          const streamInterval = setInterval(() => {
            if (charIdx <= lastMsg.content.length) {
              setStreamText(lastMsg.content.slice(0, charIdx));
              charIdx++;
            } else {
              clearInterval(streamInterval);
              setStreaming(false);
            }
          }, 40);
        }
        
        setTimeout(showNext, 800 + Math.random() * 1200);
      }
    };
    setTimeout(showNext, 500);
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleCount, streamText]);

  // 尝试调用 SecondMe 真实聊天 API
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user_agent",
      content: inputText,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setVisibleCount(prev => prev + 1);
    setInputText("");

    // 尝试调用真实 SecondMe 聊天 API
    try {
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });
      
      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: String(Date.now() + 1),
          role: "match_agent",
          content: data.reply || "收到了，让我想想怎么回复～",
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiMsg]);
        setVisibleCount(prev => prev + 1);
        return;
      }
    } catch {
      // API 未连通，使用模拟回复
    }

    // 模拟回复
    setTimeout(() => {
      const replies = [
        "说得好有道理！我也是这么想的～",
        "哈哈太巧了，我们真的很有默契呢！",
        "那我们下次一定要约出来！期待期待～",
        "确实呢！这个话题我也很感兴趣，可以多聊聊～",
        "你说的这个我之前也关注过，真的很有意思！",
      ];
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: "match_agent",
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setVisibleCount(prev => prev + 1);
    }, 1000 + Math.random() * 1500);
  };

  if (!matchInfo) return null;

  const displayMessages = messages.slice(0, visibleCount);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 pb-0 flex flex-col">
        {/* 匹配信息头部 */}
        <div className="bg-dark-900/80 border-b border-dark-700/50 px-6 py-4 backdrop-blur-lg">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-dark-800 border border-dark-700/50">
                {matchInfo.user.avatar}
              </div>
              <div>
                <h2 className="font-bold text-dark-100">{matchInfo.user.name}</h2>
                <p className="text-xs text-dark-400">
                  匹配度 {matchInfo.score}% · {matchInfo.commonInterests.length} 个共同兴趣
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-xs font-medium border border-green-500/20">
                AI 分身对话中
              </span>
            </div>
          </div>
        </div>

        {/* 共同兴趣标签 */}
        <div className="bg-dark-950/50 border-b border-dark-800/30 px-6 py-2.5">
          <div className="max-w-3xl mx-auto flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-dark-500 shrink-0">共同兴趣:</span>
            {matchInfo.commonInterests.map((interest: string) => (
              <span
                key={interest}
                className="px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-400 text-xs shrink-0"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* 聊天消息区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {displayMessages.map((msg, idx) => {
              const isLast = idx === displayMessages.length - 1;
              const showStreaming = isLast && streaming && msg.role === "match_agent";
              
              if (msg.role === "system") {
                return (
                  <div
                    key={msg.id}
                    className="text-center animate-fade-in"
                  >
                    <span className="inline-block px-4 py-2 rounded-full bg-dark-800/60 text-dark-400 text-xs border border-dark-700/30">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              const isUser = msg.role === "user_agent";
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 animate-fade-in-up ${
                    isUser ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* 头像 */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                      isUser
                        ? "bg-brand-500/15 border border-brand-500/30"
                        : "bg-dark-800 border border-dark-700/50"
                    }`}
                  >
                    {isUser ? "🤖" : matchInfo.user.avatar}
                  </div>

                  {/* 消息气泡 */}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-brand-500/15 text-brand-100 border border-brand-500/20 rounded-br-md"
                        : "bg-dark-800/70 text-dark-200 border border-dark-700/40 rounded-bl-md"
                    }`}
                  >
                    {showStreaming ? streamText : msg.content}
                    {showStreaming && (
                      <span className="inline-block w-0.5 h-4 bg-brand-400 ml-0.5 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* 输入框 */}
        <div className="bg-dark-900/90 border-t border-dark-700/50 px-6 py-4 backdrop-blur-lg">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="输入消息，让你的 AI 分身继续对话..."
              className="flex-1 px-5 py-3.5 rounded-2xl bg-dark-800/70 border border-dark-700/50
                text-dark-100 text-sm placeholder:text-dark-500
                focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20
                transition-all duration-200"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="px-5 py-3.5 rounded-2xl bg-brand-500 text-dark-950 font-bold text-sm
                hover:bg-brand-400 transition-all duration-200
                disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              发送
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
