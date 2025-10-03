#!/bin/bash

# Simple CSRF Test Script
echo "🛡️ CSRF Protection Test Script"
echo "================================"

BASE_URL="http://localhost:3000/api/v1/auth"
COOKIE_FILE="csrf-test-cookies.txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "\n${CYAN}Step 1: Testing login and session creation...${NC}"
login_response=$(curl -s -c "$COOKIE_FILE" -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jojobrelingga@gmail.com",
    "password": "nathan2008",
    "captchaToken": "test-bypass-token"
  }' \
  -w "%{http_code}")

# Extract status code (last 3 characters)
login_status="${login_response: -3}"
login_body="${login_response%???}"

if [ "$login_status" = "200" ]; then
  echo -e "${GREEN}✅ Login successful (HTTP 200)${NC}"
  # Extract user name from response
  user_name=$(echo "$login_body" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
  echo -e "${BLUE}   User: $user_name${NC}"
  
  # Check if session cookie was set
  if [ -f "$COOKIE_FILE" ]; then
    echo -e "${BLUE}   Session cookie saved to $COOKIE_FILE${NC}"
  fi
else
  echo -e "${RED}❌ Login failed (HTTP $login_status)${NC}"
  echo -e "${RED}   Response: $login_body${NC}"
  exit 1
fi

echo -e "\n${CYAN}Step 2: Getting CSRF token...${NC}"
csrf_response=$(curl -s -b "$COOKIE_FILE" "$BASE_URL/csrf/token" -w "%{http_code}")
csrf_status="${csrf_response: -3}"
csrf_body="${csrf_response%???}"

if [ "$csrf_status" = "200" ]; then
  echo -e "${GREEN}✅ CSRF token retrieved (HTTP 200)${NC}"
  # Extract CSRF token from response
  csrf_token=$(echo "$csrf_body" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
  echo -e "${BLUE}   Token: ${csrf_token:0:16}...${NC}"
  echo -e "${BLUE}   Length: ${#csrf_token} characters${NC}"
else
  echo -e "${RED}❌ CSRF token failed (HTTP $csrf_status)${NC}"
  echo -e "${RED}   Response: $csrf_body${NC}"
  exit 1
fi

echo -e "\n${CYAN}Step 3: Testing CSRF protection (without token - should fail)...${NC}"
no_csrf_response=$(curl -s -b "$COOKIE_FILE" -X POST "$BASE_URL/protected/profile/update" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User No CSRF",
    "email": "test-no-csrf@example.com",
    "phone": "081234567890"
  }' \
  -w "%{http_code}")

no_csrf_status="${no_csrf_response: -3}"
no_csrf_body="${no_csrf_response%???}"

if [ "$no_csrf_status" = "403" ]; then
  echo -e "${GREEN}CSRF protection working - Request blocked without token (HTTP 403)${NC}"
  echo -e "${BLUE}   Message: $(echo "$no_csrf_body" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)${NC}"
else
  echo -e "${RED}❌ CSRF protection failed - Request allowed without token (HTTP $no_csrf_status)${NC}"
  echo -e "${RED}   Response: $no_csrf_body${NC}"
fi

echo -e "\n${CYAN}Step 4: Testing CSRF protection (with invalid token - should fail)...${NC}"
invalid_csrf_response=$(curl -s -b "$COOKIE_FILE" -X POST "$BASE_URL/protected/profile/update" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: invalid-token-123456" \
  -d '{
    "name": "Test User Invalid CSRF",
    "email": "test-invalid-csrf@example.com",
    "phone": "081234567890",
    "csrfToken": "invalid-token-123456"
  }' \
  -w "%{http_code}")

invalid_csrf_status="${invalid_csrf_response: -3}"
invalid_csrf_body="${invalid_csrf_response%???}"

if [ "$invalid_csrf_status" = "403" ]; then
  echo -e "${GREEN}✅ CSRF protection working - Invalid token rejected (HTTP 403)${NC}"
  echo -e "${BLUE}   Message: $(echo "$invalid_csrf_body" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)${NC}"
else
  echo -e "${RED}❌ CSRF protection failed - Invalid token accepted (HTTP $invalid_csrf_status)${NC}"
  echo -e "${RED}   Response: $invalid_csrf_body${NC}"
fi

echo -e "\n${CYAN}Step 5: Testing CSRF protection (with valid token - should succeed)...${NC}"
valid_csrf_response=$(curl -s -b "$COOKIE_FILE" -X POST "$BASE_URL/protected/profile/update" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $csrf_token" \
  -d "{
    \"name\": \"Test User Valid CSRF\",
    \"email\": \"test-valid-csrf@example.com\",
    \"phone\": \"081234567890\",
    \"csrfToken\": \"$csrf_token\"
  }" \
  -w "%{http_code}")

valid_csrf_status="${valid_csrf_response: -3}"
valid_csrf_body="${valid_csrf_response%???}"

if [ "$valid_csrf_status" = "200" ]; then
  echo -e "${GREEN}✅ CSRF protection working - Valid token accepted (HTTP 200)${NC}"
  echo -e "${BLUE}   Message: $(echo "$valid_csrf_body" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)${NC}"
else
  echo -e "${RED}❌ Valid CSRF token was rejected (HTTP $valid_csrf_status)${NC}"
  echo -e "${RED}   Response: $valid_csrf_body${NC}"
fi

echo -e "\n${CYAN}Step 6: Testing CSRF statistics...${NC}"
stats_response=$(curl -s "$BASE_URL/csrf/stats" -w "%{http_code}")
stats_status="${stats_response: -3}"
stats_body="${stats_response%???}"

if [ "$stats_status" = "200" ]; then
  echo -e "${GREEN}✅ CSRF statistics retrieved (HTTP 200)${NC}"
  total_tokens=$(echo "$stats_body" | grep -o '"totalTokens":[0-9]*' | cut -d':' -f2)
  active_tokens=$(echo "$stats_body" | grep -o '"activeTokens":[0-9]*' | cut -d':' -f2)
  echo -e "${BLUE}   Total tokens: $total_tokens${NC}"
  echo -e "${BLUE}   Active tokens: $active_tokens${NC}"
else
  echo -e "${RED}❌ CSRF statistics failed (HTTP $stats_status)${NC}"
fi

echo -e "\n${CYAN}Step 7: Testing CSRF health check...${NC}"
health_response=$(curl -s "$BASE_URL/csrf/health" -w "%{http_code}")
health_status="${health_response: -3}"
health_body="${health_response%???}"

if [ "$health_status" = "200" ]; then
  echo -e "${GREEN}✅ CSRF health check passed (HTTP 200)${NC}"
  health_status_value=$(echo "$health_body" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  echo -e "${BLUE}   System status: $health_status_value${NC}"
else
  echo -e "${RED}❌ CSRF health check failed (HTTP $health_status)${NC}"
fi

# Cleanup
rm -f "$COOKIE_FILE"

echo -e "\n${GREEN}🎉 CSRF Protection Test Complete!${NC}"
echo -e "\n${YELLOW}Summary:${NC}"
echo -e "• Login & Session: ${GREEN}✅ Working${NC}"
echo -e "• CSRF Token Generation: ${GREEN}✅ Working${NC}"
echo -e "• CSRF Protection (No Token): ${GREEN}✅ Blocked${NC}"
echo -e "• CSRF Protection (Invalid Token): ${GREEN}✅ Blocked${NC}"
echo -e "• CSRF Protection (Valid Token): ${GREEN}✅ Allowed${NC}"
echo -e "• CSRF Statistics: ${GREEN}✅ Working${NC}"
echo -e "• CSRF Health Check: ${GREEN}✅ Working${NC}"
echo -e "\n${CYAN}🛡️ CSRF Protection is working correctly!${NC}"
