"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar({ userName }: { userName?: string }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "首页" },
    { href: "/register", label: "兴趣" },
    { href: "/match", label: "匹配" },
    { href: "/chat", label: "对话" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-dark-950/70 border-b border-dark-700/50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">🤝</span>
          <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            搭子Agent
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "bg-brand-500/15 text-brand-400"
                  : "text-dark-300 hover:text-dark-100 hover:bg-dark-800/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {userName && (
            <span className="ml-3 px-3 py-1.5 rounded-lg bg-dark-800 text-sm text-dark-300 border border-dark-700">
              {userName}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
