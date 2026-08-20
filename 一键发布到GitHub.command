#!/bin/bash
# =====================================================
# SCMC 义卖网站 · GitHub Pages 全自动发布
# 双击运行：自动登录 GitHub → 自动建仓库 → 推送 →
# 自动开启 Pages → 自动触发部署 → 给出公网地址。
# 以后每次更新网站：再双击一次即可。
# =====================================================
cd "$(dirname "$0")"

echo "========================================"
echo " SCMC 义卖网站 · GitHub Pages 全自动发布"
echo "========================================"

# ---------- 1. 准备 GitHub CLI ----------
GH="./.tools/gh/bin/gh"
if [ ! -x "$GH" ]; then
  echo "[1/6] 首次运行：下载 GitHub CLI ..."
  mkdir -p .tools/gh-tmp
  curl -sL --max-time 180 -o /tmp/gh.zip "https://github.com/cli/cli/releases/download/v2.97.0/gh_2.97.0_macOS_arm64.zip" || { echo "❌ 下载失败，请检查网络"; read -n1 -p "按回车关闭窗口"; exit 1; }
  unzip -o -q /tmp/gh.zip -d .tools/gh-tmp
  mkdir -p .tools/gh
  cp -R .tools/gh-tmp/gh_*/bin .tools/gh/
  rm -rf .tools/gh-tmp /tmp/gh.zip
  chmod +x .tools/gh/bin/gh
  echo "      GitHub CLI 就绪"
fi

# ---------- 2. 登录 ----------
if ! "$GH" auth status >/dev/null 2>&1; then
  echo "[2/6] 首次使用需要登录 GitHub，浏览器将打开授权页："
  echo "      输入验证码并点 Authorize GitHub 即可。"
  "$GH" auth login -h github.com -p https -w || { echo "❌ 登录失败，请重试"; read -n1 -p "按回车关闭窗口"; exit 1; }
fi
"$GH" auth setup-git >/dev/null 2>&1
echo "[2/6] 已登录 GitHub"

# ---------- 3. 仓库信息 ----------
read -p "仓库名（直接回车默认 scmc-charity-exhibition）: " REPO
REPO=${REPO:-scmc-charity-exhibition}
USER=$("$GH" api user -q .login 2>/dev/null)
echo "[3/6] 账号 $USER · 仓库 $REPO"

# ---------- 4. git 准备 ----------
if ! git config --global user.name >/dev/null 2>&1; then
  git config --global user.name "$USER"
fi
if ! git config --global user.email >/dev/null 2>&1; then
  git config --global user.email "$USER@users.noreply.github.com"
fi
git init 2>/dev/null
git add .
git commit -m "SCMC charity sale site" 2>/dev/null || git commit -am "update" 2>/dev/null || true
git branch -M main

# ---------- 5. 建仓库 / 推送 ----------
echo "[4/6] 创建/推送仓库 ..."
git remote remove origin 2>/dev/null
if "$GH" repo view "$USER/$REPO" >/dev/null 2>&1; then
  git remote add origin "https://github.com/$USER/$REPO.git"
  git push -u origin main || { echo "❌ 推送失败"; read -n1 -p "按回车关闭窗口"; exit 1; }
else
  git remote add origin "https://github.com/$USER/$REPO.git" 2>/dev/null
  "$GH" repo create "$REPO" --public --source=. --push || { echo "❌ 创建仓库失败（名称可能已被占用，换个名字重试）"; read -n1 -p "按回车关闭窗口"; exit 1; }
fi

# ---------- 6. 开启 Pages + 触发部署 ----------
echo "[5/6] 开启 GitHub Pages ..."
if "$GH" api "repos/$USER/$REPO/pages" -X POST -f build_type=workflow >/dev/null 2>&1; then
  echo "      Pages 已开启（GitHub Actions 方式）"
else
  echo "      Pages 已开启过或无需设置"
fi
echo "[6/6] 触发自动部署 ..."
"$GH" workflow run deploy.yml 2>/dev/null || true

echo ""
echo "✅ 全部完成！约 1-2 分钟后即可访问："
echo ""
echo "   https://$USER.github.io/$REPO/"
echo ""
echo "（首次构建需要 1-2 分钟，打不开就等一会再刷新）"
echo "以后更新网站：再次双击运行本脚本即可，全自动。"
echo ""
read -n1 -p "按回车关闭窗口"
