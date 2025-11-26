const { exec } = require('child_process');

// Colors for console output
console.colors = {
  black: '\x1b[30m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

const log = (message, color = colors.white) => {
  console.log(`${color}${message}${colors.reset}`);
};

const baseURL = 'http://localhost:3000/api/v1/auth';

// Test configuration
const testConfig = {
  email: 'csrftest@example.com',
  password: 'testpassword123',
  name: 'CSRF Test User 2'
};

class CSRFDebugger {
  constructor() {
    this.sessionCookie = '';
    this.csrfToken = '';
  }

  async makeRequest(method, endpoint, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = `${baseURL}${endpoint}`;
      
      // Build curl command with proper JSON escaping
      let curlCommand = `curl -s -X ${method} -H "Content-Type: application/json" -c test-cookies.txt -b test-cookies.txt`;
      
      // Add custom headers
      for (const [key, value] of Object.entries(headers)) {
        curlCommand += ` -H "${key}: ${value}"`;
      }
      
      // Add data if provided
      if (data) {
        const jsonResponse = JSON.stringify(Response).replace(/"/g, '\\"');
        curlCommand += ` -d "${jsonData}"`;
      }
      
      // Add response formatting and URL
      curlCommand += ` -w "\\n%{http_code}" "${url}"`;
      
      log(`🔍 Executing: ${curlCommand}`, colors.blue);
      
      exec(curlCommand, (error, stdout, stderr) => {
        if (error) {
          log(`❌ Curl error: ${error.message}`, colors.red);
          reject(error);
          return;
        }

        const lines = stdout.trim().split('\n');
        const statusCode = parseInt(lines[lines.length - 1]);
        const responseBody = lines.slice(0, -1).join('\n');

        log(`📡 Response (${statusCode}): ${responseBody}`, colors.cyan);

        try {
          const jsonResponse = JSON.parse(responseBody);
          resolve({
            status: statusCode,
            data: jsonResponse,
            headers: {}
          });
        } catch (e) {
          resolve({
            status: statusCode,
            data: { message: responseBody },
            headers: {}
          });
        }
      });
    });
  }

  async checkServerHealth() {
    log('🏥 Checking server health...', colors.cyan);
    try {
      // Use csrf/health endpoint instead
      const response = await this.makeRequest('GET', '/csrf/health');
      if (response.status === 200) {
        log('✅ Server is running and healthy', colors.green);
        return true;
      } else {
        log('❌ Server health check failed', colors.red);
        return false;
      }
    } catch (error) {
      log('❌ Cannot connect to server - make sure it\'s running on localhost:3000', colors.red);
      return false;
    }
  }

  async debugLogin() {
    log('\n🔐 Debug: Testing login process...', colors.yellow);
    
    try {
      // First try to see what endpoints are available
      log('📋 Available endpoints check...', colors.blue);
      
      const response = await this.makeRequest('POST', '/login', {
        email: testConfig.email,
        password: testConfig.password,
        captchaToken: 'test-bypass-token'
      });

      if (response.status === 200 && response.data.success) {
        log('✅ Login successful!', colors.green);
        log(`   User: ${response.data.data?.user?.name}`, colors.blue);
        log(`   Token: ${response.data.token?.substring(0, 20)}...`, colors.blue);
        return true;
      } else {
        log(`❌ Login failed: ${response.data.message}`, colors.red);
        log(`   Status: ${response.status}`, colors.red);
        return false;
      }
    } catch (error) {
      log(`❌ Login debug error: ${error.message}`, colors.red);
      return false;
    }
  }

  async debugCSRFToken() {
    log('\n🛡️ Debug: Testing CSRF token generation...', colors.yellow);
    
    try {
      const response = await this.makeRequest('GET', '/csrf/token');

      if (response.status === 200 && response.data.success) {
        this.csrfToken = response.data.data.csrfToken;
        log('✅ CSRF token generated successfully!', colors.green);
        log(`   Token: ${this.csrfToken.substring(0, 20)}...`, colors.blue);
        log(`   Expires: ${response.data.data.expiresIn}`, colors.blue);
        return true;
      } else {
        log(`❌ CSRF token generation failed: ${response.data.message}`, colors.red);
        return false;
      }
    } catch (error) {
      log(`❌ CSRF token debug error: ${error.message}`, colors.red);
      return false;
    }
  }

  async debugCSRFProtection() {
    log('\n🧪 Debug: Testing CSRF protection...', colors.yellow);

    // Test without token
    log('\n🔸 Test: Request without CSRF token', colors.blue);
    try {
      const response = await this.makeRequest('POST', '/protected/profile/update', {
        name: 'Debug Test User',
        email: 'debug@example.com'
      });

      if (response.status === 403) {
        log('✅ Protection working - request blocked without token', colors.green);
      } else {
        log(`⚠️ Unexpected response: ${response.status}`, colors.yellow);
      }
    } catch (error) {
      log(`❌ Debug error: ${error.message}`, colors.red);
    }

    // Test with valid token
    log('\n🔸 Test: Request with valid CSRF token', colors.blue);
    try {
      const response = await this.makeRequest('POST', '/protected/profile/update', {
        name: 'Debug Test User Valid',
        email: 'debug-valid@example.com',
        csrfToken: this.csrfToken
      }, {
        'X-CSRF-Token': this.csrfToken
      });

      if (response.status === 200) {
        log('✅ Protection working - valid token accepted', colors.green);
      } else {
        log(`⚠️ Unexpected response: ${response.status} - ${response.data.message}`, colors.yellow);
      }
    } catch (error) {
      log(`❌ Debug error: ${error.message}`, colors.red);
    }
  }

  async debugCSRFStats() {
    log('\n📊 Debug: CSRF statistics...', colors.yellow);
    
    try {
      const response = await this.makeRequest('GET', '/csrf/stats');

      if (response.status === 200 && response.data.success) {
        const stats = response.data.data;
        log('✅ Statistics retrieved:', colors.green);
        log(`   Total tokens: ${stats.totalTokens}`, colors.blue);
        log(`   Active tokens: ${stats.activeTokens}`, colors.blue);
        log(`   Expired tokens: ${stats.expiredTokens}`, colors.blue);
      } else {
        log(`❌ Statistics failed: ${response.data.message}`, colors.red);
      }
    } catch (error) {
      log(`❌ Statistics error: ${error.message}`, colors.red);
    }
  }

  async runDebugSession() {
    log('🔍 CSRF Protection Debug Session', colors.bright + colors.magenta);
    log('═'.repeat(50), colors.magenta);

    // Step 1: Check server health
    const serverOk = await this.checkServerHealth();
    if (!serverOk) {
      log('\n❌ Server is not responding. Please start the backend server first.', colors.red);
      log('   Run: npm run dev', colors.yellow);
      return;
    }

    // Step 2: Debug login
    const loginOk = await this.debugLogin();
    if (!loginOk) {
      log('\n⚠️ Login failed, but continuing with other tests...', colors.yellow);
    }

    // Step 3: Debug CSRF token
    const tokenOk = await this.debugCSRFToken();
    if (!tokenOk) {
      log('\n⚠️ CSRF token generation failed, but continuing...', colors.yellow);
    }

    // Step 4: Debug CSRF protection (only if we have a token)
    if (tokenOk) {
      await this.debugCSRFProtection();
    }

    // Step 5: Debug statistics
    await this.debugCSRFStats();

    // Final summary
    log('\n🎯 Debug Session Summary', colors.bright + colors.cyan);
    log('═'.repeat(40), colors.cyan);
    log(`✅ Server Health: ${serverOk ? 'OK' : 'FAILED'}`, serverOk ? colors.green : colors.red);
    log(`✅ Login Process: ${loginOk ? 'OK' : 'FAILED'}`, loginOk ? colors.green : colors.red);
    log(`✅ CSRF Token: ${tokenOk ? 'OK' : 'FAILED'}`, tokenOk ? colors.green : colors.red);
    
    if (serverOk && loginOk && tokenOk) {
      log('\n🛡️ CSRF system is working correctly!', colors.bright + colors.green);
    } else {
      log('\n⚠️ Some issues detected. Check the logs above for details.', colors.yellow);
    }

    log('\n💡 Tips for debugging:', colors.cyan);
    log('   - Make sure backend server is running (npm run dev)', colors.blue);
    log('   - Check if user credentials are correct', colors.blue);
    log('   - Verify rate limiting is not blocking requests', colors.blue);
    log('   - Check server logs for detailed error messages', colors.blue);
  }
}

// Interactive mode
const csrfDebugger = new CSRFDebugger();

// Handle process interruption gracefully
process.on('SIGINT', () => {
  log('\n\n👋 Debug session interrupted. Goodbye!', colors.yellow);
  process.exit(0);
});

// Run debug session
csrfDebugger.runDebugSession().catch(error => {
  log(`\n❌ Debug session failed: ${error.message}`, colors.red);
  log('Stack trace:', colors.red);
  console.error(error.stack);
  process.exit(1);
});
