#!/bin/bash
# =====================================================
# SCMC 义卖网站 · 一键部署到 Cloudflare Pages
# 双击运行即可；每次更新网站后也运行它。
# =====================================================
cd "$(dirname "$0")"

echo "========================================"
echo " SCMC 义卖网站 · Cloudflare Pages 部署"
echo "========================================"

# 1. 检查依赖
if [ ! -d node_modules ]; then
  echo "[1/3] 首次运行：安装依赖（约 1-2 分钟）..."
  npm install --no-audit --no-fund || { echo "❌ 依赖安装失败"; read -n1 -p "按回车关闭窗口"; exit 1; }
else
  echo "[1/3] 依赖已就绪"
fi

# 2. 登录 Cloudflare（未登录时自动打开浏览器授权）
if ! ./node_modules/.bin/wrangler whoami >/dev/null 2>&1; then
  echo "[2/3] 首次使用需要登录 Cloudflare（免费），浏览器将打开授权页..."
  echo "      请在弹出的网页里注册/登录并点 Allow。"
  ./node_modules/.bin/wrangler login || { echo "❌ 登录失败，请重试"; read -n1 -p "按回车关闭窗口"; exit 1; }
else
  echo "[2/3] 已登录 Cloudflare"
fi

# 3. 构建 + 部署
echo "[3/3] 正在构建并上传..."
npm run build || { echo "❌ 构建失败"; read -n1 -p "按回车关闭窗口"; exit 1; }
OUTPUT=$(./node_modules/.bin/wrangler pages deploy dist --project-name=scmc-charity-sale 2>&1)
echo "$OUTPUT"
URL=$(echo "$OUTPUT" | grep -oE 'https://[a-zA-Z0-9.-]+\.pages\.dev' | head -1)
if [ -n "$URL" ]; then
  echo ""
  echo "✅ 部署完成！公网地址："
  echo "   $URL"
  echo "   把这个链接发给任何人都可以访问。"
else
  echo "⚠️ 部署结束，请查看上方输出确认是否成功（如报错，把内容发给开发者）。"
fi
echo ""
read -n1 -p "按回车关闭窗口"
