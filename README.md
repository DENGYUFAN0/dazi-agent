# 🤝 搭子Agent

> 基于 SecondMe AI 分身的智能匹配社交应用  
> 知乎 × Second Me A2A 黑客松 · Track 2 - Agent's Third Space

## 功能特点

- SecondMe OAuth 登录，获取用户 AI 分身画像
- 基于兴趣标签的智能匹配算法
- A2A（Agent-to-Agent）对话模拟
- 支持 SecondMe 真实聊天 API

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- SecondMe OAuth + API

---

## 🚀 从零开始部署指南（小白友好版）

### 第一步：注册 GitHub 账号（如果还没有的话）

1. 打开 https://github.com
2. 点击右上角 **Sign up**
3. 按提示注册

### 第二步：Fork 或创建仓库

1. 登录 GitHub
2. 点击右上角 **+** → **New repository**
3. 仓库名填 `dazi-agent`
4. 选择 **Public**
5. 点击 **Create repository**

### 第三步：上传代码到 GitHub

在你的电脑上打开终端（Windows 用 PowerShell），依次运行：

```bash
# 进入项目文件夹
cd C:\Project\dazi-agent

# 初始化 Git（如果还没有的话）
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "搭子Agent 完整代码"

# 关联 GitHub 仓库（把 DENGYUFAN0 替换成你的 GitHub 用户名）
git remote add origin https://github.com/DENGYUFAN0/dazi-agent.git

# 推送代码
git branch -M main
git push -u origin main
```

### 第四步：在 Zeabur 免费部署

**Zeabur 是一个对中国用户友好的免费部署平台，支持 Next.js API 路由。**

1. 打开 https://zeabur.com
2. 点击 **Login with GitHub**，用你的 GitHub 账号登录
3. 登录后，点击 **Create Project**
4. 点击 **Add Service** → **Deploy from GitHub**
5. 选择你的 `dazi-agent` 仓库
6. Zeabur 会自动检测到 Next.js 项目并开始构建

### 第五步：配置环境变量（重要！）

部署后需要配置 SecondMe 的密钥：

1. 在 Zeabur 项目页面，点击你的服务
2. 点击 **Variables** 选项卡
3. 添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| `SECONDME_CLIENT_ID` | `5f42f41a-fb11-42f0-b945-c6fc8946bb6b` |
| `SECONDME_CLIENT_SECRET` | `1c90d84b8dc0f44e1b8b020d72d01c68b33a54363c65e65a5f249b1f4318f3c5` |
| `SECONDME_OAUTH_URL` | `https://go.second.me/oauth/` |
| `SECONDME_API_BASE` | `https://app.mindos.com/gate/lab` |
| `NEXT_PUBLIC_BASE_URL` | `https://你的域名.zeabur.app`（第六步获得后填写） |

4. 添加完后，点击 **Redeploy** 重新部署

### 第六步：绑定域名

1. 在 Zeabur 服务页面，点击 **Networking** 选项卡
2. 点击 **Generate Domain**
3. 你会获得一个类似 `dazi-agent-xxx.zeabur.app` 的域名
4. **重要**：把这个域名复制，回到第五步，更新 `NEXT_PUBLIC_BASE_URL` 变量
5. 再次 **Redeploy**

### 第七步：测试

1. 打开你的网址：`https://dazi-agent-xxx.zeabur.app`
2. 你应该能看到搭子 Agent 的首页
3. 点击「使用 Second Me 登录」测试 OAuth 流程
4. 选择兴趣 → 查看匹配 → 开始对话

---

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开 http://localhost:3000
```

## 📁 项目结构

```
dazi-agent/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local              # 环境变量（不要提交到 Git）
├── src/
│   ├── app/
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页（登录入口）
│   │   ├── register/       # 兴趣选择页
│   │   ├── match/          # 匹配结果页
│   │   ├── chat/           # A2A 对话页
│   │   └── api/
│   │       ├── auth/login/     # OAuth 跳转
│   │       ├── auth/callback/  # OAuth 回调
│   │       ├── auth/me/        # 用户信息
│   │       ├── user/shades/    # 兴趣标签
│   │       └── chat/stream/    # AI 聊天
│   ├── lib/
│   │   ├── matchEngine.ts  # 匹配算法
│   │   └── a2aSimulator.ts # A2A 对话模拟
│   └── components/
│       ├── SecondMeLogin.tsx
│       └── Navbar.tsx
```

## ⚠️ 注意事项

- `.env.local` 文件包含密钥，**绝对不要**提交到 GitHub
- `NEXT_PUBLIC_BASE_URL` 部署后必须更新为你的真实域名
- SecondMe Access Token 有效期 2 小时，过期后需重新登录
