import { SignJWT, jwtVerify } from 'jose';
import type { User } from './types';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'your-super-secret-jwt-key-please-change-this-in-production';

// La clé secrète doit être un Uint8Array pour jose
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

// Recommendation: Ensure your JWT_SECRET is at least 32 characters long for HS256 for strong security.
if (JWT_SECRET_STRING.length < 32) {
  console.warn('WARNING: JWT_SECRET is less than 32 characters. It is recommended to use a secret of at least 32 characters for HS256 for strong security.');
}

export async function generateToken(user: Omit<User, 'password'>): Promise<string> {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Token expire in 1 day
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Error verifying token with jose:', error);
    throw new Error('Token invalide ou expiré');
  }
}

// Self-test for jose JWT
async function selfTestJose() {
  console.log('--- Running Jose JWT Self-Test ---');
  const testPayload = { userId: 'test-user-jose', email: 'test-jose@example.com', role: 'tester' };
  try {
    const testToken = await generateToken(testPayload as any); // Cast to any for simplicity in test
    console.log('Jose Self-Test: Generated test token:', testToken);
    const decodedTest = await verifyToken(testToken);
    console.log('Jose Self-Test: Token successfully verified and decoded:', decodedTest);
  } catch (e) {
    console.error('Jose Self-Test: An error occurred during self-test:', e);
  }
  console.log('--- Jose JWT Self-Test Finished ---');
}

if (process.env.NODE_ENV === 'development') {
  selfTestJose();
}
