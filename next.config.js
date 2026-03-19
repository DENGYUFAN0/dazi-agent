/** @type {import('next').NextConfig} */
const nextConfig = {
  // 完整 SSR 模式，不使用静态导出（因为需要 API 路由）
  reactStrictMode: true,
};

module.exports = nextConfig;
