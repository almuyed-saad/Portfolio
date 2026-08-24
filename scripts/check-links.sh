#!/usr/bin/env bash
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to read data/projects.json" >&2
  exit 2
fi

if ! jq empty data/projects.json >/dev/null 2>&1; then
  echo "data/projects.json is not valid JSON" >&2
  exit 2
fi

mapfile -t URLS < <(
  {
    printf '%s\n' \
      "https://almuyed-saad.github.io/Portfolio/" \
      "https://almuyed-saad.github.io/Portfolio/robots.txt" \
      "https://almuyed-saad.github.io/Portfolio/sitemap.xml"
    jq -r '.[] | if .live != "" then .live else empty end, if .source != "private" and .github != "" then .github else empty end' data/projects.json
  } | awk 'NF' | sort -u
)

failures=0
for url in "${URLS[@]}"; do
  status="$(curl -L -sS -o /dev/null -w '%{http_code}' --max-time "${CURL_MAX_TIME:-30}" "$url" 2>/dev/null || printf '000')"
  if [[ "$status" =~ ^[23][0-9][0-9]$ ]]; then
    printf 'PASS %-3s %s\n' "$status" "$url"
  else
    printf 'FAIL %-3s %s\n' "$status" "$url"
    failures=$((failures + 1))
  fi
done

if (( failures > 0 )); then
  printf '\n%d link check(s) failed.\n' "$failures" >&2
  exit 1
fi

printf '\nAll %d monitored links passed.\n' "${#URLS[@]}"
