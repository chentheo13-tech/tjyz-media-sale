# 公网部署指南

网站是纯静态单页应用（Vite 构建产物在 `dist/`），无需服务器。
已支持两种免费托管：**Cloudflare Pages** 与 **GitHub Pages**。
全站资源路径已做根路径兼容（相对路径 + BASE_URL），两种平台都不会出现图片 404。

## 🚀 一键脚本（最省事）

项目根目录有两个可直接**双击运行**的脚本：

| 脚本 | 作用 |
|---|---|
| `一键部署到Cloudflare.command` | 自动登录（首次）+ 构建 + 发布到 Cloudflare Pages |
| `一键发布到GitHub.command` | 全自动：登录 → 自动建仓库 → 推送 → 开启 Pages → 触发部署 |

双击后终端窗口会逐步提示，跟着提示操作即可。

---

# 方案 A：Cloudflare Pages（国内速度更好，推荐）

## 方案一：命令行直接部署（最快，推荐）

已在项目里配好，只需三步：

### 1. 注册 / 登录 Cloudflare（免费）

> 打开 https://dash.cloudflare.com/sign-up 注册账号（可用邮箱或 Google/GitHub 登录）。

### 2. 首次登录 CLI

```bash
cd /Users/dongwei/Documents/DeepSeek/SCMC-v2
npx wrangler login
```

浏览器会弹出授权页，点 Allow 即可（一次性操作）。

### 3. 部署

```bash
npm run deploy
```

自动完成：构建 → 上传 `dist/` → 创建项目 `scmc-charity-exhibition`。
完成后终端会输出公网地址：

```
https://scmc-charity-exhibition.pages.dev
```

把这个链接发给任何人即可访问（国内一般可正常打开）。

## 以后更新网站

改完代码后，一条命令重新部署：

```bash
npm run deploy
```

约 1 分钟内新版本上线。每次部署都有版本记录，可在
Cloudflare 控制台（Pages → scmc-charity-exhibition → Deployments）回滚到任意旧版本。

## 方案二：Git 集成自动部署（可选，之后想弄再弄）

1. 把项目推到一个 GitHub 仓库（`git init && git add . && git commit && git push`）
2. Cloudflare 控制台 → Pages → Create a project → Connect to Git → 选仓库
3. 构建配置：Framework preset = Vite，Build command = `npm run build`，
   Output directory = `dist`
4. 之后每次 `git push` 自动发布，无需手动执行命令

## 自定义域名（可选）

控制台 → Pages → 项目 → Custom domains → 添加域名。
绑定自己的域名需要域名 DNS 托管在 Cloudflare（免费方案即可）。
pages.dev 自带 HTTPS，自定义域名也自动签证书，不需要备案。

## 说明

- 免费额度：无限带宽、每月 500 次构建，对义卖展示站绰绰有余
- 缓存策略已在 `public/_headers` 配好（图片 7 天、静态资源长期缓存，
  页面本体不缓存，更新即时生效）
- 网站无后端、无表单、无数据库，纯静态部署没有任何安全风险
- 本地开发服务器（http://localhost:5174）不受影响，照常开发
- 两平台可同时部署：内容一致，哪个快用哪个，互不影响

---

# 方案 B：GitHub Pages（与 XMTI 同平台）

项目已配好两种发布方式，任选其一：

### B-1：GitHub Actions 自动部署（推荐，配一次永久生效）

1. 在 GitHub 新建仓库（如 `scmc-charity-exhibition`，选 Public/Private 均可）
2. 推送代码：
   ```bash
   cd /Users/dongwei/Documents/DeepSeek/SCMC-v2
   git init
   git add .
   git commit -m "SCMC charity sale site"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/scmc-charity-exhibition.git
   git push -u origin main
   ```
3. GitHub 仓库页 → Settings → Pages → Source 选 **GitHub Actions**
4. 推送后自动构建发布，地址：
   `https://<你的用户名>.github.io/scmc-charity-exhibition/`
5. 以后每次 `git push` 自动更新（无需其他操作）

### B-2：命令行一键发布（gh-pages）

```bash
npm run deploy:github
```

首次使用前先在 GitHub 建好仓库并 `git remote add origin ...`，
再把仓库 Settings → Pages → Source 设为 `gh-pages` 分支。

---

# 其他可选平台（对比）

| 平台 | 费用 | 国内速度 | 说明 |
|---|---|---|---|
| Cloudflare Pages | 免费 | 好 | 本方案，永久域名 pages.dev |
| GitHub Pages | 免费 | 一般（偶发慢） | 已配好子路径兼容与自动部署（XMTI 同款） |
| Netlify / Vercel | 免费 | 一般 | 类似，操作差不多 |
| 腾讯云 COS / 阿里云 OSS | 少量费用 | 很好 | 绑定自定义域名需 ICP 备案 |
| 云服务器 + 备案 | 费用较高 | 很好 | 最正式，但流程最长 |
