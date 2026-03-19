"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const INTEREST_CATEGORIES = [
  {
    title: "运动健身",
    emoji: "💪",
    items: ["跑步", "健身", "游泳", "篮球", "足球", "瑜伽", "骑行", "登山"],
  },
  {
    title: "文化生活",
    emoji: "📚",
    items: ["读书", "写作", "摄影", "绘画", "音乐", "电影", "戏剧", "书法"],
  },
  {
    title: "户外休闲",
    emoji: "🎣",
    items: ["钓鱼", "露营", "徒步", "旅行", "潜水", "滑雪", "攀岩", "冲浪"],
  },
  {
    title: "社交娱乐",
    emoji: "🎮",
    items: ["桌游", "电竞", "剧本杀", "密室逃脱", "KTV", "烹饪", "品酒", "咖啡"],
  },
  {
    title: "知识学习",
    emoji: "🧠",
    items: ["编程", "AI", "设计", "理财", "语言", "历史", "哲学", "科学"],
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [shades, setShades] = useState<string[]>([]);
  const [loadingShades, setLoadingShades] = useState(true);
  const [saving, setSaving] = useState(false);

  // 尝试从 SecondMe API 获取真实兴趣标签
  useEffect(() => {
    async function fetchShades() {
      try {
        const res = await fetch("/api/user/shades");
        if (res.ok) {
          const data = await res.json();
          if (data.shades && data.shades.length > 0) {
            setShades(data.shades);
            // 自动勾选匹配的兴趣
            const allItems = INTEREST_CATEGORIES.flatMap((c) => c.items);
            const matched = data.shades.filter((s: string) =>
              allItems.some((item) => item.includes(s) || s.includes(item))
            );
            setSelected(matched);
          }
        }
      } catch {
        // 未登录或 API 未连通，忽略
      } finally {
        setLoadingShades(false);
      }
    }
    fetchShades();
  }, []);

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    setSaving(true);
    // 将兴趣存储到 localStorage
    localStorage.setItem("dazi_interests", JSON.stringify(selected));
    localStorage.setItem("dazi_shades", JSON.stringify(shades));
    setTimeout(() => {
      router.push("/match");
    }, 500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <h1 className="text-4xl font-black mb-3">
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                选择你的兴趣
              </span>
            </h1>
            <p className="text-dark-400">
              选择至少 3 个兴趣，我们将为你找到最合适的搭子
            </p>
          </div>

          {/* SecondMe 标签提示 */}
          {shades.length > 0 && (
            <div
              className="mb-8 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 
                animate-fade-in-up"
              style={{ animationDelay: "0.2s", opacity: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-brand-400 text-sm font-bold">✨ SecondMe 识别到的兴趣标签</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {shades.map((shade) => (
                  <span
                    key={shade}
                    className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-medium"
                  >
                    {shade}
                  </span>
                ))}
              </div>
            </div>
          )}

          {loadingShades && (
            <div className="text-center mb-8 text-dark-400 text-sm animate-fade-in">
              <svg className="animate-spin h-5 w-5 inline mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              正在获取 SecondMe 兴趣画像...
            </div>
          )}

          {/* 兴趣分类 */}
          <div className="space-y-8">
            {INTEREST_CATEGORIES.map((category, catIdx) => (
              <div
                key={category.title}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.2 + catIdx * 0.1}s`, opacity: 0 }}
              >
                <h2 className="text-lg font-bold text-dark-200 mb-3 flex items-center gap-2">
                  <span>{category.emoji}</span>
                  {category.title}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {category.items.map((interest) => {
                    const isSelected = selected.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 
                          border ${
                          isSelected
                            ? "bg-brand-500/15 border-brand-500/40 text-brand-300 shadow-sm shadow-brand-500/10"
                            : "bg-dark-800/40 border-dark-700/40 text-dark-300 hover:bg-dark-800/70 hover:border-dark-600"
                        }`}
                      >
                        {isSelected && <span className="mr-1">✓</span>}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 提交按钮 */}
          <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: "0.8s", opacity: 0 }}>
            <div className="mb-4 text-sm text-dark-400">
              已选择 <span className="text-brand-400 font-bold">{selected.length}</span> 个兴趣
            </div>
            <button
              onClick={handleSubmit}
              disabled={selected.length < 3 || saving}
              className="px-10 py-4 rounded-2xl font-bold text-lg
                bg-gradient-to-r from-brand-500 to-brand-700 text-dark-950
                hover:from-brand-400 hover:to-brand-600
                transition-all duration-300
                shadow-lg shadow-brand-500/20
                hover:shadow-xl hover:shadow-brand-500/30
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "正在保存..." : selected.length < 3 ? `还需选择 ${3 - selected.length} 个` : "开始匹配 →"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
