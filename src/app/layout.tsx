import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "搭子Agent - 找到志同道合的伙伴",
  description: "基于 SecondMe AI 分身的智能匹配社交应用，知乎 × Second Me A2A 黑客松项目",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="noise-bg">
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
