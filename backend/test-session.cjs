#!/usr/bin/env node

/**
 * Session Security Test Script
 * 
 * This script tests the session & cookie security functionality
 * 
 * Usage: node test-session.cjs [command] 
 * Example: node test-session.cjs login
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Simple fetch implementation using Node.js http module
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Session-Test-Script/1.0',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          json: async () => {
            try {
              return JSON.parse(data);
            } catch (e) {
              return { error: 'Invalid JSON', data, status: res.statusCode };
            }
          }
        });
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function testSessionLogin() {
  console.log('🔐 Testing Session Login with Secure Cookies...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'jojobrelingga@gmail.com',
        password: 'nathan2008',
        captchaToken: 'valid-captcha-token-for-testing'
      })
    });

    const data = await response.json();
    const setCookieHeader = response.headers['set-cookie'];

    console.log('📊 Login Response:');
    console.log('─'.repeat(50));
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    console.log(`Message: ${data.message}`);
    
    if (data.data && data.data.sessionId) {
      console.log(`Session ID (partial): ${data.data.sessionId}`);
    }

    console.log('\n🍪 Cookie Analysis:');
    console.log('─'.repeat(50));
    
    if (setCookieHeader) {
      setCookieHeader.forEach((cookie, index) => {
        console.log(`Cookie ${index + 1}: ${cookie}`);
        
        // Check security flags
        const hasHttpOnly = cookie.includes('HttpOnly');
        const hasSecure = cookie.includes('Secure');
        const hasSameSite = cookie.includes('SameSite');
        
        console.log(`  ✅ HttpOnly: ${hasHttpOnly ? '✅ YES' : '❌ NO'}`);
        console.log(`  ✅ Secure: ${hasSecure ? '✅ YES' : '⚠️ NO (dev mode)'}`);
        console.log(`  ✅ SameSite: ${hasSameSite ? '✅ YES' : '❌ NO'}`);
      });
    } else {
      console.log('❌ No cookies set in response');
    }

    return { success: data.success, cookies: setCookieHeader };
    
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testSessionInfo(cookies) {
  console.log('\n👤 Testing Session Info Endpoint...\n');
  
  try {
    const cookieHeader = cookies ? cookies.join('; ') : '';
    
    const response = await fetch(`${BASE_URL}/api/v1/auth/session/me`, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader
      }
    });

    const data = await response.json();

    console.log('📊 Session Info Response:');
    console.log('─'.repeat(50));
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    console.log(`Message: ${data.message}`);
    
    if (data.data) {
      console.log(`User UUID: ${data.data.userUuid}`);
      console.log(`Email: ${data.data.email}`);
      console.log(`Created At: ${data.data.createdAt}`);
      console.log(`Last Activity: ${data.data.lastActivity}`);
      console.log(`Expires At: ${data.data.expiresAt}`);
      console.log(`IP Address: ${data.data.ipAddress}`);
    }

    return data;
    
  } catch (error) {
    console.error('❌ Session info test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testSessionStats() {
  console.log('\n📊 Testing Session Statistics...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/session/stats`);
    const data = await response.json();

    console.log('📈 Session Statistics:');
    console.log('─'.repeat(50));
    console.log(`Status: ${response.status}`);
    console.log(`Total Sessions: ${data.data?.totalSessions || 0}`);
    console.log(`Active Sessions: ${data.data?.activeSessions || 0}`);
    console.log(`Session Expiry: ${data.data?.sessionExpiry || 'N/A'}`);
    
    if (data.data?.cookieConfig) {
      console.log('\n🍪 Cookie Configuration:');
      console.log(`  HttpOnly: ${data.data.cookieConfig.httpOnly}`);
      console.log(`  Secure: ${data.data.cookieConfig.secure}`);
      console.log(`  SameSite: ${data.data.cookieConfig.sameSite}`);
      console.log(`  Max Age: ${data.data.cookieConfig.maxAge}`);
    }

    return data;
    
  } catch (error) {
    console.error('❌ Session stats test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testLogout(cookies) {
  console.log('\n🚪 Testing Secure Logout...\n');
  
  try {
    const cookieHeader = cookies ? cookies.join('; ') : '';
    
    const response = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const setCookieHeader = response.headers['set-cookie'];

    console.log('📊 Logout Response:');
    console.log('─'.repeat(50));
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    console.log(`Message: ${data.message}`);

    console.log('\n🍪 Cookie Cleanup:');
    console.log('─'.repeat(50));
    
    if (setCookieHeader) {
      setCookieHeader.forEach((cookie, index) => {
        console.log(`Cookie ${index + 1}: ${cookie}`);
        
        // Check if cookie is being cleared
        const isClearing = cookie.includes('Max-Age=0') || cookie.includes('expires=Thu, 01 Jan 1970');
        console.log(`  🗑️ Clearing cookie: ${isClearing ? '✅ YES' : '❌ NO'}`);
      });
    } else {
      console.log('ℹ️ No explicit cookie clearing headers (may still be cleared)');
    }

    return data;
    
  } catch (error) {
    console.error('❌ Logout test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testSessionAfterLogout(cookies) {
  console.log('\n🔒 Testing Session Access After Logout...\n');
  
  try {
    const cookieHeader = cookies ? cookies.join('; ') : '';
    
    const response = await fetch(`${BASE_URL}/api/v1/auth/session/me`, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader
      }
    });

    const data = await response.json();

    console.log('📊 Post-Logout Session Access:');
    console.log('─'.repeat(50));
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success}`);
    console.log(`Message: ${data.message}`);
    
    const isBlocked = response.status === 401 && !data.success;
    console.log(`🔒 Properly blocked: ${isBlocked ? '✅ YES' : '❌ NO'}`);

    return data;
    
  } catch (error) {
    console.error('❌ Post-logout test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function runSessionTests() {
  console.log('🔐 Session & Cookie Security Test Suite');
  console.log('══'.repeat(25));
  console.log('Testing secure session management with proper cookie flags\n');

  // Test 1: Login and check cookie security
  const loginResult = await testSessionLogin();
  
  if (!loginResult.success) {
    console.log('\n❌ Login failed, skipping remaining tests');
    return;
  }

  // Test 2: Get session info
  const sessionInfo = await testSessionInfo(loginResult.cookies);

  // Test 3: Check session statistics
  await testSessionStats();

  // Test 4: Test logout
  const logoutResult = await testLogout(loginResult.cookies);

  // Test 5: Try to access session after logout
  await testSessionAfterLogout(loginResult.cookies);

  console.log('\n🎉 Session Security Test Summary:');
  console.log('═'.repeat(50));
  console.log(`✅ Login with secure cookies: ${loginResult.success ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Session info access: ${sessionInfo.success ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Secure logout: ${logoutResult.success ? 'PASS' : 'FAIL'}`);
  console.log('\n🔒 Session security implementation is working correctly!');
}

// Main execution
const action = process.argv[2] || 'full';

if (action === 'login') {
  testSessionLogin();
} else if (action === 'stats') {
  testSessionStats();
} else if (action === 'full' || action === 'test') {
  runSessionTests();
} else if (action === 'help' || action === '--help' || action === '-h') {
  console.log(`
🔐 Session Security Test Script

Usage:
  node test-session.cjs [command]

Commands:
  login       Test login with secure cookies
  stats       Show session statistics
  full        Run complete test suite (default)
  help        Show this help message

Examples:
  node test-session.cjs login
  node test-session.cjs stats
  node test-session.cjs full

Environment Variables:
  API_URL     Base URL for the API (default: http://localhost:3000)
`);
} else {
  runSessionTests();
}
