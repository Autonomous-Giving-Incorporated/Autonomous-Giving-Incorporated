#!/usr/bin/env bash
# Smoke the public AGI suite under autogive.app (or BASE_URL).
set -euo pipefail

BASE_URL="${BASE_URL:-https://autogive.app}"
EDGE_PROXY_CHECKS="${EDGE_PROXY_CHECKS:-0}"
FAIL=0

check() {
  local path="$1"
  local expect="${2:-200}"
  local url="${BASE_URL}${path}"
  local code
  code=$(curl -sS -o /tmp/agi-smoke-body -w "%{http_code}" -L -m 25 "$url" || echo "000")
  if [[ "$code" != "$expect" ]]; then
    echo "FAIL  $code (want $expect)  $url"
    FAIL=1
    return
  fi
  echo "OK    $code  $url"
}

echo "Smoke public suite @ ${BASE_URL}"
check "/"
check "/robots.txt"
check "/sitemap.xml"
check "/portfolio-signals/"
check "/impact-relay/"
check "/portfolio-signals/data/public-campaign.json"
check "/impact-relay/data/public-impact.json"

check_header() {
  local path="$1"
  local header="$2"
  local expect="$3"
  local url="${BASE_URL}${path}"
  local value
  value=$(curl -sS -I -m 25 "$url" | tr -d '\r' | awk -F ': ' -v header="$header" 'tolower($1) == tolower(header) { value = $2 } END { print value }')
  if [[ "$value" != "$expect" ]]; then
    echo "FAIL  header ${header}=${value:-<missing>} (want ${expect})  $url"
    FAIL=1
    return
  fi
  echo "OK    header ${header}  $url"
}

check_proxy_method_guard() {
  local url="${BASE_URL}/portfolio-signals/"
  local code
  code=$(curl -sS -o /tmp/agi-smoke-post -w "%{http_code}" -X POST -m 25 "$url" || echo "000")
  if [[ "$code" != "405" ]]; then
    echo "FAIL  $code (want 405)  POST $url"
    FAIL=1
    return
  fi
  echo "OK    405 POST $url"
}

# Authority contracts (privacy-safe public projections)
if ! grep -q 'advisory_only' /tmp/agi-smoke-body 2>/dev/null; then
  # re-fetch campaign for authority (last body may be impact)
  curl -sS -L -m 25 "${BASE_URL}/portfolio-signals/data/public-campaign.json" -o /tmp/agi-smoke-campaign
  if ! grep -q 'advisory_only' /tmp/agi-smoke-campaign; then
    echo "FAIL  public-campaign.json missing authority advisory_only"
    FAIL=1
  else
    echo "OK    public-campaign.json authority"
  fi
else
  echo "OK    public-campaign.json authority"
fi

curl -sS -L -m 25 "${BASE_URL}/impact-relay/data/public-impact.json" -o /tmp/agi-smoke-impact
if ! grep -q 'public_aggregate_only' /tmp/agi-smoke-impact; then
  echo "FAIL  public-impact.json missing authority public_aggregate_only"
  FAIL=1
else
  echo "OK    public-impact.json authority"
fi

# AGI title
curl -sS -L -m 25 "${BASE_URL}/" -o /tmp/agi-smoke-home
if ! grep -q 'Autonomously Giving' /tmp/agi-smoke-home; then
  echo "FAIL  AGI home missing expected title/copy"
  FAIL=1
else
  echo "OK    AGI home content"
fi

if [[ "$EDGE_PROXY_CHECKS" == "1" ]]; then
  check_header "/" "X-Content-Type-Options" "nosniff"
  check_header "/" "Content-Security-Policy" "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  check_header "/portfolio-signals/" "X-Frame-Options" "DENY"
  check_header "/impact-relay/" "Referrer-Policy" "strict-origin-when-cross-origin"
  check_proxy_method_guard
fi

if [[ "$FAIL" -ne 0 ]]; then
  echo "SMOKE FAILED"
  exit 1
fi
echo "SMOKE PASSED"
