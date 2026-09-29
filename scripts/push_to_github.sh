#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Vui lòng cung cấp GitHub Personal Access Token (PAT) hoặc mật khẩu ủy quyền:"
  echo "Cách dùng: bash scripts/push_to_github.sh <GITHUB_PERSONAL_ACCESS_TOKEN>"
  exit 1
fi

TOKEN="$1"
echo "Đang đẩy mã nguồn lên https://github.com/alo247/Video24h.git (nhánh main)..."
git push -u "https://${TOKEN}@github.com/alo247/Video24h.git" main
echo "✓ Đã đẩy thành công lên GitHub!"
