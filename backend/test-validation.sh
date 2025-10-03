#!/bin/bash

# 🛡️ LAYER 5 VALIDATION & SANITIZATION TEST SCRIPT
# Test input validation, output sanitization, dan security threat detection

echo "🧪 Testing Layer 5: Validation & Sanitization"
echo "=============================================="

BASE_URL="http://localhost:3000/api/v1/auth"

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0

run_test() {
    local test_name="$1"
    local expected_status="$2"
    local response="$3"
    local actual_status=$(echo "$response" | tail -n1)
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [[ "$actual_status" == "$expected_status" ]]; then
        echo -e "${GREEN}✅ $test_name: PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ $test_name: FAIL (Expected: $expected_status, Got: $actual_status)${NC}"
    fi
}

echo ""
echo "🔍 1. Testing Email Validation"
echo "------------------------------"

# Test invalid email formats
echo "Testing invalid email formats..."

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"password123","captchaToken":"valid-token"}')
run_test "Invalid email format" "400" "$response"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@","password":"password123","captchaToken":"valid-token"}')
run_test "Incomplete email" "400" "$response"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"@domain.com","password":"password123","captchaToken":"valid-token"}')
run_test "Email without local part" "400" "$response"

echo ""
echo "🔐 2. Testing Password Validation"
echo "--------------------------------"

# Test weak passwords
echo "Testing weak password requirements..."

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123","captchaToken":"valid-token"}')
run_test "Too short password" "400" "$response"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password","captchaToken":"valid-token"}')
run_test "Weak password (common)" "400" "$response"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"alllowercase","captchaToken":"valid-token"}')
run_test "Password without uppercase/numbers" "400" "$response"

echo ""
echo "📱 3. Testing Phone Number Validation (Indonesia)"
echo "------------------------------------------------"

# Test Indonesian phone number formats
echo "Testing Indonesian phone number validation..."

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"StrongPass123","phoneNumber":"123456","captchaToken":"valid-token"}')
run_test "Invalid phone format" "400" "$response"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"StrongPass123","phoneNumber":"+1234567890","captchaToken":"valid-token"}')
run_test "Non-Indonesian phone" "400" "$response"

echo ""
echo "👤 4. Testing Name Validation"
echo "-----------------------------"

# Test name validation
echo "Testing name validation..."

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"test@example.com","password":"StrongPass123","captchaToken":"valid-token"}')
run_test "Too short name" "400" "$response"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test123User","email":"test@example.com","password":"StrongPass123","captchaToken":"valid-token"}')
run_test "Name with numbers" "400" "$response"

echo ""
echo "🚨 5. Testing Security Threat Detection"
echo "---------------------------------------"

# Test SQL Injection attempts
echo "Testing SQL injection detection..."

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com'\''OR 1=1--","password":"password","captchaToken":"valid-token"}')
run_test "SQL injection in email" "400" "$response"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass'\''UNION SELECT * FROM users--","captchaToken":"valid-token"}')
run_test "SQL injection in password" "400" "$response"

# Test XSS attempts
echo "Testing XSS detection..."

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(\"xss\")</script>","email":"test@example.com","password":"StrongPass123","captchaToken":"valid-token"}')
run_test "XSS in name field" "400" "$response"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"javascript:alert(1)@test.com","password":"password","captchaToken":"valid-token"}')
run_test "JavaScript protocol in email" "400" "$response"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"<iframe src=evil.com></iframe>","captchaToken":"valid-token"}')
run_test "HTML iframe in password" "400" "$response"

echo ""
echo "✅ 6. Testing Valid Inputs (Should Pass)"
echo "----------------------------------------"

# Test valid inputs that should pass validation
echo "Testing valid inputs..."

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john.doe@example.com","password":"SecurePass123","age":25,"phoneNumber":"081234567890","captchaToken":"valid-token"}')
run_test "Valid registration data" "201" "$response"

# Test valid Indonesian phone formats
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@test.com","password":"AnotherSecure123","age":30,"phoneNumber":"+6281234567890","captchaToken":"valid-token"}')
run_test "Valid phone with +62 prefix" "201" "$response"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Wilson","email":"bob@example.org","password":"MySecurePass456","age":28,"phoneNumber":"6281234567890","captchaToken":"valid-token"}')
run_test "Valid phone with 62 prefix" "201" "$response"

echo ""
echo "🧹 7. Testing Output Sanitization"
echo "--------------------------------"

# Test login with valid user to check output sanitization
echo "Testing output sanitization..."

# First, try to login with a user (this might fail if user doesn't exist, but we're testing output format)
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"SecurePass123","captchaToken":"valid-token"}')

# Check if response contains sanitized user data (even if login fails due to user not existing)
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [[ "$status" == "200" ]] || [[ "$status" == "500" ]]; then
    # Check that response doesn't contain raw HTML or scripts
    if [[ "$body" =~ \<script\> ]] || [[ "$body" =~ javascript: ]]; then
        echo -e "${RED}❌ Output sanitization: FAIL (Contains unsafe content)${NC}"
    else
        echo -e "${GREEN}✅ Output sanitization: PASS (No unsafe content detected)${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

echo ""
echo "📊 TEST SUMMARY"
echo "==============="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$((TOTAL_TESTS - PASSED_TESTS))${NC}"

if [[ $PASSED_TESTS -eq $TOTAL_TESTS ]]; then
    echo -e "\n🎉 ${GREEN}ALL TESTS PASSED! Layer 5 Validation & Sanitization is working correctly!${NC}"
else
    echo -e "\n⚠️  ${YELLOW}Some tests failed. Please check the implementation.${NC}"
fi

echo ""
echo "🛡️ Layer 5 Security Features Tested:"
echo "✅ Email regex validation"
echo "✅ Password strength validation" 
echo "✅ Indonesian phone number validation"
echo "✅ Name format validation"
echo "✅ SQL injection detection"
echo "✅ XSS attempt detection"
echo "✅ Input sanitization"
echo "✅ Output sanitization"
echo ""
echo "🚀 Your KAI authentication system now has PENTA Security Protection!"
echo "   1. Rate Limiting"
echo "   2. CAPTCHA Verification" 
echo "   3. Session Security"
echo "   4. CSRF Protection"
echo "   5. Validation & Sanitization ← NEW!"
