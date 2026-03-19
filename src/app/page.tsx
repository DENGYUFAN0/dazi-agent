"use client";

import SecondMeLogin from "@/components/SecondMeLogin";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        {/* 背景装饰 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-brand-700/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-10">
          {/* Logo & 标题 */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <div className="text-7xl mb-6 animate-float">🤝</div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-600 bg-clip-text text-transparent">
                搭子Agent
              </span>
            </h1>
          </div>

          {/* 副标题 */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <p className="text-xl sm:text-2xl text-dark-300 font-light leading-relaxed max-w-lg mx-auto">
              让你的 <span className="text-brand-400 font-medium">AI 分身</span> 帮你找到
              <span className="text-brand-400 font-medium"> 志同道合</span> 的伙伴
            </p>
          </div>

          {/* 特性标签 */}
          <div
            className="flex flex-wrap justify-center gap-3 animate-fade-in-up"
            style={{ animationDelay: "0.5s", opacity: 0 }}
          >
            {[
              { emoji: "🎯", text: "兴趣精准匹配" },
              { emoji: "🤖", text: "AI分身代聊" },
              { emoji: "💬", text: "A2A智能对话" },
            ].map((tag) => (
              <span
                key={tag.text}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
                  bg-dark-800/60 border border-dark-700/50 
                  text-sm text-dark-200 backdrop-blur-sm"
              >
                <span>{tag.emoji}</span>
                {tag.text}
              </span>
            ))}
          </div>

          {/* 登录按钮 */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.7s", opacity: 0 }}>
            <SecondMeLogin />
            <p className="mt-4 text-sm text-dark-400">
              通过 SecondMe 安全授权，获取你的兴趣画像
            </p>
          </div>

          {/* 工作流程 */}
          <div
            className="animate-fade-in-up grid grid-cols-3 gap-6 pt-8"
            style={{ animationDelay: "0.9s", opacity: 0 }}
          >
            {[
              { step: "01", title: "授权登录", desc: "连接你的 SecondMe AI 分身" },
              { step: "02", title: "兴趣匹配", desc: "AI 分析你的真实兴趣标签" },
              { step: "03", title: "开始聊天", desc: "AI 分身替你破冰对话" },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center p-5 rounded-2xl bg-dark-900/40 border border-dark-700/30 
                  hover:border-brand-500/20 transition-all duration-300"
              >
                <div className="text-xs font-bold text-brand-500 tracking-widest mb-2">
                  STEP {item.step}
                </div>
                <div className="text-base font-bold text-dark-100 mb-1">{item.title}</div>
                <div className="text-xs text-dark-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部信息 */}
        <footer className="relative z-10 mt-20 mb-8 text-center text-xs text-dark-500">
          知乎 × Second Me A2A 黑客松 · Track 2 - Agent&apos;s Third Space
        </footer>
      </main>
    </>
  );
}
