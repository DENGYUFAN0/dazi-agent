"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { findMatches, MatchResult } from "@/lib/matchEngine";

export default function MatchPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    // 从 localStorage 获取用户兴趣
    const stored = localStorage.getItem("dazi_interests");
    const storedShades = localStorage.getItem("dazi_shades");
    
    const userInterests = stored ? JSON.parse(stored) : [];
    const shades = storedShades ? JSON.parse(storedShades) : [];
    
    setInterests(userInterests);

    if (userInterests.length === 0 && shades.length === 0) {
      // 没有兴趣数据，跳转到注册页
      router.push("/register");
      return;
    }

    // 模拟匹配延迟
    setTimeout(() => {
      const results = findMatches(userInterests, shades, 6);
      setMatches(results);
      setLoading(false);
    }, 1500);
  }, [router]);

  const handleChat = (match: MatchResult) => {
    localStorage.setItem("dazi_current_match", JSON.stringify({
      user: match.user,
      commonInterests: match.commonInterests,
      score: match.score,
    }));
    router.push("/chat");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <h1 className="text-4xl font-black mb-3">
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                为你找到的搭子
              </span>
            </h1>
            <p className="text-dark-400">
              基于你的兴趣：{interests.slice(0, 5).join("、")}
              {interests.length > 5 ? "..." : ""}
            </p>
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-dark-700" />
                <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
              </div>
              <p className="text-dark-300 text-lg">AI 正在为你匹配最佳搭子...</p>
              <p className="text-dark-500 text-sm mt-2">分析兴趣画像 · 计算匹配度</p>
            </div>
          )}

          {/* 匹配结果 */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {matches.map((match, idx) => (
                <div
                  key={match.user.id}
                  className="group relative p-6 rounded-2xl bg-dark-900/60 border border-dark-700/40
                    hover:border-brand-500/30 hover:bg-dark-900/80
                    transition-all duration-300 animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${0.2 + idx * 0.1}s`, opacity: 0 }}
                  onClick={() => handleChat(match)}
                >
                  {/* 匹配度标签 */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        match.score >= 50
                          ? "bg-green-500/15 text-green-400 border border-green-500/30"
                          : match.score >= 30
                          ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
                          : "bg-dark-700/50 text-dark-300 border border-dark-600/30"
                      }`}
                    >
                      匹配 {match.score}%
                    </span>
                  </div>

                  {/* 用户信息 */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl w-14 h-14 flex items-center justify-center rounded-2xl bg-dark-800 border border-dark-700/50">
                      {match.user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-dark-100 group-hover:text-brand-300 transition-colors">
                        {match.user.name}
                      </h3>
                      <p className="text-sm text-dark-400 mt-1 line-clamp-2">
                        {match.user.bio}
                      </p>
                    </div>
                  </div>

                  {/* 共同兴趣 */}
                  <div className="flex flex-wrap gap-2">
                    {match.commonInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-medium
                          border border-brand-500/20"
                      >
                        {interest}
                      </span>
                    ))}
                    {match.user.interests
                      .filter((i) => !match.commonInterests.includes(i))
                      .slice(0, 3)
                      .map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 rounded-lg bg-dark-800/60 text-dark-400 text-xs
                            border border-dark-700/30"
                        >
                          {interest}
                        </span>
                      ))}
                  </div>

                  {/* 底部操作 */}
                  <div className="mt-4 pt-4 border-t border-dark-700/30 flex items-center justify-between">
                    <span className="text-xs text-dark-500">
                      {match.commonInterests.length} 个共同兴趣
                    </span>
                    <span className="text-sm text-brand-400 font-medium 
                      group-hover:translate-x-1 transition-transform duration-200">
                      开始对话 →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 没有匹配时 */}
          {!loading && matches.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-6xl mb-4">😅</div>
              <p className="text-dark-300 text-lg">暂时没有找到匹配的搭子</p>
              <button
                onClick={() => router.push("/register")}
                className="mt-6 px-6 py-3 rounded-xl bg-brand-500/15 text-brand-400 
                  border border-brand-500/30 hover:bg-brand-500/25 transition-all"
              >
                重新选择兴趣
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
