#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/alo247/Video24h.git"
SSH_REPO="git@github.com:alo247/Video24h.git"
BRANCH="main"

echo "=========================================================="
echo "  Video24h Autonomous Factory — GitHub & Vercel Push Tool "
echo "=========================================================="
echo "Target Repository: ${REPO_URL}"
echo ""

# 1. Initialize or verify git repository
if [ ! -d ".git" ]; then
  echo "→ Initializing git repository..."
  git init -b "${BRANCH}"
fi

# 2. Configure user identity if not already set
if [ -z "$(git config user.name)" ]; then
  git config user.name "alo247"
fi
if [ -z "$(git config user.email)" ]; then
  git config user.email "athangdc9999@gmail.com"
fi

# 3. Ensure remote origin is configured
if git remote | grep -q "^origin$"; then
  git remote set-url origin "${REPO_URL}"
else
  git remote add origin "${REPO_URL}"
fi

# 4. Stage and commit changes if any
if [ -n "$(git status --porcelain)" ]; then
  echo "→ Staging all modified files..."
  git add -A
  git commit -m "feat: upgrade system for Vercel deployment and GitHub CI/CD pipeline"
else
  echo "→ Working tree clean, nothing new to commit."
fi

# 5. Check authentication token
TOKEN="${1:-${GITHUB_TOKEN:-${GH_TOKEN}}}"

if [ -n "${TOKEN}" ]; then
  echo "→ Pushing to GitHub using provided Access Token..."
  git push -u "https://${TOKEN}@github.com/alo247/Video24h.git" "${BRANCH}" --force
  echo ""
  echo "=========================================================="
  echo "✓ Push completed successfully to: ${REPO_URL} (${BRANCH})"
  echo "✓ Vercel will automatically trigger a new deployment!"
  echo "=========================================================="
  exit 0
fi

# 6. Try pushing with existing git credentials
echo "→ Checking default git credentials / SSH..."
if git push -u origin "${BRANCH}" 2>/dev/null; then
  echo ""
  echo "=========================================================="
  echo "✓ Push completed successfully to: ${REPO_URL} (${BRANCH})"
  echo "✓ Vercel will automatically trigger a new deployment!"
  echo "=========================================================="
  exit 0
fi

# 7. Provide interactive or fallback guidance
echo ""
echo "⚠️  Yêu cầu xác thực tài khoản GitHub (GitHub Personal Access Token - PAT):"
echo "Để đẩy code lên kho lưu trữ riêng của bạn, vui lòng chạy lệnh với Token của bạn:"
echo ""
echo "    bash scripts/push_to_github.sh <YOUR_GITHUB_TOKEN>"
echo ""
echo "Hoặc gán biến môi trường:"
echo "    export GITHUB_TOKEN=\"ghp_xxxxxxxxxxxx\""
echo "    npm run push"
echo ""
echo "Các bước lấy GitHub Token (PAT) trong 1 phút:"
echo " 1. Truy cập: https://github.com/settings/tokens/new"
echo " 2. Đặt tên Token (ví dụ: Video24h-deploy) & tích chọn quyền 'repo'"
echo " 3. Nhấn 'Generate token' và sao chép token."
echo " 4. Chạy lại lệnh: bash scripts/push_to_github.sh <TOKEN>"
echo "=========================================================="
exit 1
