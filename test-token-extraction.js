/**
 * Test Token Extraction
 */

const fetch = globalThis.fetch || require('node-fetch');

const BACKEND_URL = 'http://localhost:8080';

async function testTokenExtraction() {
  console.log('🔍 Testing Token Extraction...');
  
  // Register and login
  const testUser = {
    name: 'Token Test User',
    email: `tokentest-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    role: 'buyer',
    phone: `98765${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`
  };

  try {
    // Register
    console.log('📝 Registering...');
    const registerResponse = await fetch(`${BACKEND_URL}/user-service/api/v1/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (!registerResponse.ok) {
      console.log('❌ Registration failed');
      return;
    }
    console.log('✅ Registration successful');

    // Login
    console.log('🔑 Logging in...');
    const loginResponse = await fetch(`${BACKEND_URL}/user-service/api/v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('📄 Login response:', JSON.stringify(loginData, null, 2));

    const token = loginData.accessToken;
    if (!token) {
      console.log('❌ No accessToken found in response');
      return;
    }

    console.log(`✅ Token extracted: ${token.substring(0, 20)}...`);

    // Test authenticated request
    console.log('🔐 Testing authenticated request...');
    const authResponse = await fetch(`${BACKEND_URL}/user-service/api/v1/brokers/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`Status: ${authResponse.status} ${authResponse.statusText}`);
    
    if (authResponse.ok) {
      const data = await authResponse.json();
      console.log('✅ Authenticated request successful!');
      console.log(`📄 Response: ${JSON.stringify(data).substring(0, 100)}...`);
    } else {
      const error = await authResponse.text();
      console.log(`❌ Authenticated request failed: ${error}`);
    }

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

testTokenExtraction().catch(console.error);
