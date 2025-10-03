#!/bin/bash

# CSRF Manual Test Script
echo "🛡️ Manual CSRF Test untuk KAI Authentication"
echo "=============================================="

BASE_URL="http://localhost:3000/api/v1/auth"

echo ""
echo "📝 Step 1: Login untuk get session cookie..."
curl -c cookies.txt -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jojobrelingga@gmail.com",
    "password": "nathan2008", 
    "captchaToken": "test-bypass-token"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "📝 Step 2: Get CSRF token..."
curl -b cookies.txt "$BASE_URL/csrf/token" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "📝 Step 3: Test CSRF-protected endpoint tanpa token (should fail)..."
curl -b cookies.txt -X POST "$BASE_URL/protected/profile/update" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "081234567890"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "📝 Step 4: Test dengan CSRF token (manual - ganti TOKEN_HERE)..."
echo "curl -b cookies.txt -X POST \"$BASE_URL/protected/profile/update\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -H \"X-CSRF-Token: TOKEN_HERE\" \\"
echo "  -d '{"
echo "    \"name\": \"Test User Valid\","
echo "    \"email\": \"test-valid@example.com\","
echo "    \"phone\": \"081234567890\","
echo "    \"csrfToken\": \"TOKEN_HERE\""
echo "  }' \\"
echo "  -w \"\\nHTTP Status: %{http_code}\\n\" \\"
echo "  -s"

echo ""
echo "📝 Step 5: Check CSRF statistics..."
curl "$BASE_URL/csrf/stats" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "📝 Step 6: Check CSRF health..."
curl "$BASE_URL/csrf/health" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "✅ Manual test complete! Check the responses above."
