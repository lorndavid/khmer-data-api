#!/bin/bash
# ========================================================
# KhmerAPI Test & Latency Benchmarking Suite
# Tests all endpoints and measures response speed
# ========================================================

BASE_URL="${1:-https://khmerapi.lorndavid.online}"

echo "=========================================================="
echo "🚀 Testing KhmerAPI Service: $BASE_URL"
echo "=========================================================="

test_endpoint() {
    local method="$1"
    local path="$2"
    local desc="$3"
    local url="${BASE_URL}${path}"

    # Measure HTTP status and latency in seconds
    local response
    response=$(curl -s -o /tmp/khmerapi_test_body.json -w "%{http_code}:%{time_total}" -X "$method" "$url" -H "Accept: application/json")
    
    local http_code=$(echo "$response" | cut -d':' -f1)
    local time_total=$(echo "$response" | cut -d':' -f2)
    local ms=$(awk "BEGIN {print int($time_total * 1000)}")

    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e " \033[0;32m✔ [PASS]\033[0m $method $path -> HTTP $http_code (${ms}ms) | $desc"
    else
        echo -e " \033[0;31m✖ [FAIL]\033[0m $method $path -> HTTP $http_code (${ms}ms) | $desc"
        cat /tmp/khmerapi_test_body.json 2>/dev/null | head -n 3
    fi
}

echo ""
echo "📊 1. Core Health & Gateway Index"
echo "----------------------------------------------------------"
test_endpoint "GET" "/health" "Healthcheck & Database Status"
test_endpoint "GET" "/api/v1" "Gateway API Catalog"

echo ""
echo "🏛️ 2. Administrative Data Endpoints"
echo "----------------------------------------------------------"
test_endpoint "GET" "/api/v1/provinces" "All 25 Provinces list"
test_endpoint "GET" "/api/v1/provinces/12" "Phnom Penh Details"
test_endpoint "GET" "/api/v1/districts?province_code=12" "Phnom Penh Districts"
test_endpoint "GET" "/api/v1/communes?district_code=1201" "Chamkar Mon Communes"
test_endpoint "GET" "/api/v1/villages?limit=5" "Villages sample"
test_endpoint "GET" "/api/v1/postal-codes?limit=5" "Postal codes list"
test_endpoint "GET" "/api/v1/locations/120101" "Hierarchical Location Tree"

echo ""
echo "🔍 3. Search & Analytics"
echo "----------------------------------------------------------"
test_endpoint "GET" "/api/v1/search?q=Phnom%20Penh" "Search query: Phnom Penh"
test_endpoint "GET" "/api/v1/search?q=%E1%9E%9F%E1%9F%80%E1%9E%98%E1%9E%9A%E1%9E%B2%E1%9E%9Params" "Search Khmer: សៀមរាប"
test_endpoint "GET" "/api/v1/statistics" "Platform Administrative Totals"
test_endpoint "GET" "/api/v1/demographics/population" "Cambodia Demographics"

echo ""
echo "🗺️ 4. Geographic GIS Layers"
echo "----------------------------------------------------------"
test_endpoint "GET" "/api/v1/geo/provinces" "Provinces GeoJSON Boundary"

echo ""
echo "=========================================================="
echo "⚡ All API tests completed!"
echo "=========================================================="
