#!/usr/bin/env bash
set -euo pipefail

# ResumeAI Chrome 扩展打包脚本
#
# 环境变量（可选）：
#   ICON16_URL, ICON48_URL, ICON128_URL  指定图标URL，自动下载并生成对应尺寸PNG
#   EXT_API_BASE, EXT_API_TOKEN          生成 config.json，供插件默认读取后端域名与鉴权
#   TPL_DEFAULT_ID                       默认模板ID写入 config.json

cd "$(dirname "$0")"

echo "[1/3] 生成占位图标..."
cat > icon-128.png.base64 <<'EOF'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=
EOF
base64 -d icon-128.png.base64 > icon-128.png
rm -f icon-128.png.base64

cp icon-128.png icon-48.png
cp icon-128.png icon-16.png
if command -v sips >/dev/null 2>&1; then
  sips -s format png -z 48 48 icon-48.png >/dev/null
  sips -s format png -z 16 16 icon-16.png >/dev/null
fi

if [ -n "${ICON16_URL:-}" ] || [ -n "${ICON48_URL:-}" ] || [ -n "${ICON128_URL:-}" ]; then
  echo "下载自定义图标..."
  if [ -n "${ICON128_URL:-}" ]; then curl -fsSL "$ICON128_URL" -o icon-128.png || true; fi
  if [ -n "${ICON48_URL:-}" ]; then curl -fsSL "$ICON48_URL" -o icon-48.png || true; fi
  if [ -n "${ICON16_URL:-}" ]; then curl -fsSL "$ICON16_URL" -o icon-16.png || true; fi
fi

echo "生成默认配置文件 config.json..."
cat > config.json <<JSON
{
  "apiBase": "${EXT_API_BASE:-/api}",
  "apiToken": "${EXT_API_TOKEN:-}",
  "templateDefaultId": "${TPL_DEFAULT_ID:-}"
}
JSON

echo "[2/3] 校验 manifest 与文件..."
for f in manifest.json content.js background.js popup.html popup.js icon-16.png icon-48.png icon-128.png config.json; do
  if [ ! -f "$f" ]; then
    echo "缺少文件: $f" >&2
    exit 1
  fi
done

echo "[3/3] 创建压缩包..."
zip -r -q resumeai-extension.zip manifest.json content.js background.js popup.html popup.js icon-16.png icon-48.png icon-128.png config.json
echo "✅ 完成: $(pwd)/resumeai-extension.zip"
