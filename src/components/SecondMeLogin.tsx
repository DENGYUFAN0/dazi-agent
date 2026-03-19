"use client";

import { useState } from "react";

export default function SecondMeLogin() {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    window.location.href = "/api/auth/login";
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="group relative inline-flex items-center justify-center gap-3 
        px-8 py-4 rounded-2xl font-bold text-lg
        bg-gradient-to-r from-brand-500 to-brand-700 
        text-dark-950 
        hover:from-brand-400 hover:to-brand-600
        transition-all duration-300
        shadow-lg shadow-brand-500/20
        hover:shadow-xl hover:shadow-brand-500/30
        hover:scale-[1.02]
        disabled:opacity-60 disabled:cursor-not-allowed
        animate-pulse-glow"
    >
      {/* SecondMe Logo SVG */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <path d="M15.5 14c1.5-0.8 3-1 4.5-0.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
      
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          正在跳转...
        </span>
      ) : (
        "使用 Second Me 登录"
      )}

      {/* 悬浮光效 */}
      <span className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
    </button>
  );
}
