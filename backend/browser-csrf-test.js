// Browser Console Test untuk CSRF Protection
// Buka browser console (F12) di localhost:3000 dan run code ini

console.log('🛡️ Testing CSRF Protection in Browser');

// Step 1: Login
async function testCSRFLogin() {
  try {
    const loginResponse = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'jojobrelingga@gmail.com',
        password: 'nathan2008',
        captchaToken: 'test-bypass-token'
      }),
      credentials: 'include'
    });
    
    const loginResult = await loginResponse.json();
    console.log('✅ Login Result:', loginResult);
    return loginResponse.ok;
  } catch (error) {
    console.error('❌ Login Error:', error);
    return false;
  }
}

// Step 2: Get CSRF Token
async function testGetCSRFToken() {
  try {
    const response = await fetch('/api/v1/auth/csrf/token', {
      credentials: 'include'
    });
    
    const result = await response.json();
    console.log('🛡️ CSRF Token Response:', result);
    
    if (result.success) {
      window.csrfToken = result.data.csrfToken;
      console.log('✅ CSRF Token stored:', window.csrfToken.substring(0, 16) + '...');
      return result.data.csrfToken;
    }
    return null;
  } catch (error) {
    console.error('❌ CSRF Token Error:', error);
    return null;
  }
}

// Step 3: Test Protected Form without CSRF (should fail)
async function testWithoutCSRF() {
  try {
    const response = await fetch('/api/v1/auth/protected/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User No CSRF',
        email: 'test-no-csrf@example.com',
        phone: '081234567890'
      }),
      credentials: 'include'
    });
    
    const result = await response.json();
    console.log('❌ Without CSRF (should fail):', result);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('❌ Test Error:', error);
  }
}

// Step 4: Test Protected Form with CSRF (should succeed)
async function testWithCSRF() {
  if (!window.csrfToken) {
    console.error('❌ No CSRF token available');
    return;
  }
  
  try {
    const response = await fetch('/api/v1/auth/protected/profile/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': window.csrfToken
      },
      body: JSON.stringify({
        name: 'Test User With CSRF',
        email: 'test-with-csrf@example.com',
        phone: '081234567890',
        csrfToken: window.csrfToken
      }),
      credentials: 'include'
    });
    
    const result = await response.json();
    console.log('✅ With CSRF (should succeed):', result);
    console.log('Status:', response.status);
    
    // Check for new CSRF token in headers
    const newToken = response.headers.get('X-New-CSRF-Token');
    if (newToken) {
      window.csrfToken = newToken;
      console.log('🔄 New CSRF Token received:', newToken.substring(0, 16) + '...');
    }
  } catch (error) {
    console.error('❌ Test Error:', error);
  }
}

// Run all tests
async function runAllCSRFTests() {
  console.log('🧪 Starting CSRF Protection Tests...');
  
  console.log('\n1. Testing Login...');
  const loginSuccess = await testCSRFLogin();
  
  if (!loginSuccess) {
    console.error('❌ Login failed, stopping tests');
    return;
  }
  
  console.log('\n2. Getting CSRF Token...');
  const csrfToken = await testGetCSRFToken();
  
  if (!csrfToken) {
    console.error('❌ CSRF token failed, stopping tests');
    return;
  }
  
  console.log('\n3. Testing without CSRF token...');
  await testWithoutCSRF();
  
  console.log('\n4. Testing with CSRF token...');
  await testWithCSRF();
  
  console.log('\n🎉 CSRF Tests Complete!');
}

// Export functions to global scope
window.testCSRFLogin = testCSRFLogin;
window.testGetCSRFToken = testGetCSRFToken;
window.testWithoutCSRF = testWithoutCSRF;
window.testWithCSRF = testWithCSRF;
window.runAllCSRFTests = runAllCSRFTests;

console.log('📚 Available functions:');
console.log('- runAllCSRFTests() - Run all tests');
console.log('- testCSRFLogin() - Test login only');
console.log('- testGetCSRFToken() - Get CSRF token only');
console.log('- testWithoutCSRF() - Test without token');
console.log('- testWithCSRF() - Test with token');

console.log('\n🚀 Run: runAllCSRFTests()');
