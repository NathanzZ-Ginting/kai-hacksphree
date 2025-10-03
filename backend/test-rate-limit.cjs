#!/usr/bin/env node

/**
 * Rate Limit Test Script
 * 
 * This script tests the rate limiting functionality by sending multiple requests
 * to the authentication endpoints.
 * 
 * Usage: node test-rate-limit.js [endpoint] [count]
 * Example: node test-rate-limit.js login 10
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
        'User-Agent': 'RateLimit-Test-Script/1.0',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: {
            get: (name) => res.headers[name.toLowerCase()]
          },
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

async function testRateLimit(endpoint = 'login', count = 10) {
  console.log(`🧪 Testing rate limit for ${endpoint} endpoint`);
  console.log(`📡 Sending ${count} requests to ${BASE_URL}/api/v1/auth/${endpoint}`);
  console.log('─'.repeat(50));

  const testData = {
    login: {
      email: 'jojobrelingga@gmail.com',
      password: 'wrongpassword', // Using wrong password to trigger failed attempts
      captchaToken: 'valid-captcha-token-for-testing' // Changed to something that might pass
    },
    register: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      age: 25,
      phoneNumber: '1234567890',
      captchaToken: 'valid-captcha-token-for-testing'
    }
  };

  const payload = testData[endpoint];
  if (!payload) {
    console.error(`❌ Invalid endpoint: ${endpoint}. Use 'login' or 'register'`);
    return;
  }

  const requests = [];
  const startTime = Date.now();

  for (let i = 1; i <= count; i++) {
    const requestPromise = fetch(`${BASE_URL}/api/v1/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'RateLimit-Test-Script/1.0'
      },
      body: JSON.stringify(payload)
    })
    .then(async (response) => {
      try {
        const data = await response.json();
        const headers = {
          'x-ratelimit-limit': response.headers.get('X-RateLimit-Limit'),
          'x-ratelimit-remaining': response.headers.get('X-RateLimit-Remaining'),
          'x-ratelimit-reset': response.headers.get('X-RateLimit-Reset')
        };
        
        return {
          requestNumber: i,
          status: response.status,
          success: data.success,
          message: data.message || data.error || 'No message',
          headers,
          timestamp: new Date().toISOString()
        };
      } catch (parseError) {
        return {
          requestNumber: i,
          status: response.status,
          error: `Failed to parse response: ${parseError.message}`,
          timestamp: new Date().toISOString()
        };
      }
    })
    .catch(error => ({
      requestNumber: i,
      error: error.message,
      timestamp: new Date().toISOString()
    }));

    requests.push(requestPromise);

    // Small delay between requests to simulate real usage
    if (i < count) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('⏳ Waiting for all requests to complete...\n');
  
  const results = await Promise.all(requests);
  const endTime = Date.now();
  
  console.log('📊 Results:');
  console.log('─'.repeat(50));
  
  let successCount = 0;
  let rateLimitedCount = 0;
  let errorCount = 0;

  results.forEach(result => {
    if (result.error) {
      console.log(`❌ Request ${result.requestNumber}: ERROR - ${result.error}`);
      errorCount++;
    } else {
      const statusIcon = result.status === 200 ? '✅' : 
                       result.status === 429 ? '🚫' : '⚠️';
      
      console.log(
        `${statusIcon} Request ${result.requestNumber}: ${result.status} - ${result.message?.substring(0, 50)}...`
      );
      
      if (result.headers['x-ratelimit-limit']) {
        console.log(`   📈 Rate Limit: ${result.headers['x-ratelimit-remaining']}/${result.headers['x-ratelimit-limit']} remaining`);
      }
      
      if (result.status === 200 || result.status === 201) successCount++;
      else if (result.status === 429) rateLimitedCount++;
      else errorCount++;
    }
  });

  console.log('\n📈 Summary:');
  console.log('─'.repeat(50));
  console.log(`Total requests: ${count}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`🚫 Rate limited: ${rateLimitedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`⏱️  Total time: ${endTime - startTime}ms`);
  
  if (rateLimitedCount > 0) {
    console.log('\n🎉 Rate limiting is working correctly!');
  } else {
    console.log('\n⚠️  No rate limiting detected. Check your configuration.');
  }
}

async function getRateLimitStats() {
  try {
    console.log('📊 Fetching rate limit statistics...\n');
    
    const response = await fetch(`${BASE_URL}/api/v1/auth/rate-limit/stats`);
    const data = await response.json();
    
    if (data.success) {
      console.log('📈 Rate Limit Statistics:');
      console.log('─'.repeat(50));
      console.log(`Login Rate Limiter:`);
      console.log(`  - Active entries: ${data.data.login.totalEntries}`);
      console.log(`  - Blocked IPs: ${data.data.login.blockedIPs}`);
      console.log(`  - ${data.data.login.description}`);
      console.log('');
      console.log(`Register Rate Limiter:`);
      console.log(`  - Active entries: ${data.data.register.totalEntries}`);
      console.log(`  - Blocked IPs: ${data.data.register.blockedIPs}`);
      console.log(`  - ${data.data.register.description}`);
      console.log(`\n🕐 Updated: ${data.data.timestamp}`);
    } else {
      console.log('❌ Failed to fetch statistics:', data.message);
    }
  } catch (error) {
    console.log('❌ Error fetching statistics:', error.message);
  }
}

// Main execution
const endpoint = process.argv[2] || 'login';
const count = parseInt(process.argv[3]) || 10;
const action = process.argv[2];

if (action === 'stats') {
  getRateLimitStats();
} else if (action === 'help' || action === '--help' || action === '-h') {
  console.log(`
🧪 Rate Limit Test Script

Usage:
  node test-rate-limit.cjs [command] [options]

Commands:
  login [count]     Test login rate limiting (default: 10 requests)
  register [count]  Test register rate limiting (default: 10 requests)
  stats            Show current rate limit statistics
  help             Show this help message

Examples:
  node test-rate-limit.cjs login 15
  node test-rate-limit.cjs register 5
  node test-rate-limit.cjs stats

Environment Variables:
  API_URL          Base URL for the API (default: http://localhost:3000)
`);
} else {
  testRateLimit(endpoint, count);
}
