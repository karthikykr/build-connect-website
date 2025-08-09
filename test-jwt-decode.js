/**
 * Test JWT Token Decoding
 */

function decodeJWT(token) {
  try {
    // JWT has 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decode header
    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
    
    // Decode payload
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    
    return { header, payload };
  } catch (error) {
    console.log('❌ Failed to decode JWT:', error.message);
    return null;
  }
}

// Test with a sample token from our login
const sampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTQyMjAwMTYsImV4cCI6MTc1NDI1NjAxNn0.JWH4yqFk_NCY7F-Onw1EijUHFJ-YVbpIvHyW9WZcPRE";

console.log('🔍 Decoding JWT Token...');
console.log(`Token: ${sampleToken.substring(0, 50)}...`);

const decoded = decodeJWT(sampleToken);
if (decoded) {
  console.log('\n📄 JWT Header:');
  console.log(JSON.stringify(decoded.header, null, 2));
  
  console.log('\n📄 JWT Payload:');
  console.log(JSON.stringify(decoded.payload, null, 2));
  
  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  const exp = decoded.payload.exp;
  const iat = decoded.payload.iat;
  
  console.log('\n⏰ Token Timing:');
  console.log(`Issued at (iat): ${iat} (${new Date(iat * 1000).toISOString()})`);
  console.log(`Expires at (exp): ${exp} (${new Date(exp * 1000).toISOString()})`);
  console.log(`Current time: ${now} (${new Date(now * 1000).toISOString()})`);
  console.log(`Is expired: ${now > exp ? 'YES' : 'NO'}`);
  console.log(`Time until expiry: ${exp - now} seconds`);
  
  // Check for user information
  console.log('\n👤 User Information in Token:');
  const userFields = ['userId', 'user_id', 'id', 'sub', 'email', 'role'];
  let hasUserInfo = false;
  
  for (const field of userFields) {
    if (decoded.payload[field]) {
      console.log(`✅ ${field}: ${decoded.payload[field]}`);
      hasUserInfo = true;
    }
  }
  
  if (!hasUserInfo) {
    console.log('⚠️  No user information found in token payload');
    console.log('💡 This might be why authentication is failing');
  }
  
} else {
  console.log('❌ Failed to decode token');
}

console.log('\n💡 Possible issues:');
console.log('1. Token might be missing user ID in payload');
console.log('2. Backend might expect different Authorization header format');
console.log('3. Backend JWT secret might be different');
console.log('4. Backend might require additional headers');
