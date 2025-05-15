# @tesseract/utils

A comprehensive collection of secure, zero-dependency utilities for Node.js backend applications. This package provides battle-tested implementations for common backend functionality including authentication, security, and data handling.

This package is an in-house utility library developed by Tesseract to provide flexible and reliable utilities specifically for our backend services.

## Features

- **Security Focused**: Implements security best practices by default
- **Modular Design**: Use only what you need with tree-shakable imports
- **Comprehensive**: Covers common backend utility needs in one package
- **TypeScript**: Fully typed API with detailed documentation
- **Configurable**: Sensible defaults with customization options
- **Well Tested**: Thoroughly tested with high coverage

## Installation

```bash
npm install @tesseract/utils
# or
yarn add @tesseract/utils
# or
bun add @tesseract/utils
```

## Modules

### TOTP (Time-based One-Time Password)

Secure implementation of TOTP for two-factor authentication.

```typescript
import { totp } from '@tesseract/utils';

// Generate a new secret key
const secret = totp.generateSecret();

// Generate URI for QR code
const uri = totp.generateUri(
  secret,
  'user@example.com',
  'MyApp'
);

// Verify a code
const isValid = totp.verify(secret, '123456');
```

### Password Handling

Secure password hashing and verification.

```typescript
import { password } from '@tesseract/utils';

// Hash a password
const hashedPassword = await password.hash('user-password');

// Verify a password
const isValid = await password.verify('user-password', hashedPassword);

// Generate a secure random password
const newPassword = password.generate({ length: 12, includeSymbols: true });
```

### Session Management

Utilities for handling user sessions securely.

```typescript
import { session } from '@tesseract/utils';

// Create a new session
const { accessToken, refreshToken } = await session.create({
  userId: 'user-123',
  sessionId: 'session-456',
});

// Validate a token
const payload = await session.validate(accessToken);

// Refresh a token
const newTokens = await session.refresh(refreshToken);
```

### Crypto Utilities

Encryption, decryption, and other cryptographic operations.

```typescript
import { crypto } from '@tesseract/utils';

// Encrypt data
const encrypted = await crypto.encrypt('sensitive data', process.env.SECRET_KEY);

// Decrypt data
const decrypted = await crypto.decrypt(encrypted, process.env.SECRET_KEY);

// Generate a random string
const randomString = crypto.randomString(32);
```

### Cache Utilities

Simplified caching operations.

```typescript
import { cache } from '@tesseract/utils';

// Set a cache value
await cache.set('key', { data: 'value' }, 3600); // 1 hour TTL

// Get a cached value
const value = await cache.get('key');

// Delete from cache
await cache.delete('key');
```

### API Response Formatting

Consistent API response formatting.

```typescript
import { response } from '@tesseract/utils';

// Success response
return response.success({
  data: { user: { id: 1, name: 'John' } },
  code: 200,
});

// Error response
return response.error({
  message: 'Resource not found',
  code: 404,
});
```

## TOTP Module Details

### Features

- Uses SHA-256 by default instead of the less secure SHA-1
- Compatible with Google Authenticator, Microsoft Authenticator, Authy, etc.
- Generates standard otpauth:// URIs for QR code generation

### API Reference

#### `totp.generateSecret(length?: number): string`

Generates a random Base32 encoded secret key.

- `length` (optional): Length of the secret in bytes (default: 20)
- Returns: Base32 encoded secret string

#### `totp.verify(secret: string, token: string, window?: number): boolean`

Verifies a TOTP code against a secret.

- `secret`: The Base32 encoded secret
- `token`: The TOTP code to verify
- `window` (optional): Time windows to check before/after current time (default: 1)
- Returns: `true` if valid, `false` otherwise

#### `totp.generate(secret: string, counter?: number): string`

Generates a TOTP code for the given secret and counter.

- `secret`: The Base32 encoded secret
- `counter` (optional): The specific counter value (default: current time period)
- Returns: 6-digit TOTP code

#### `totp.generateUri(secret: string, accountName: string, issuer: string): string`

Generates a URI for QR code generation.

- `secret`: The Base32 encoded secret
- `accountName`: User identifier (typically email)
- `issuer`: Application/service name
- Returns: URI string for QR code generation

## Password Module Details

### Features

- Uses Argon2id by default (configurable to use bcrypt)
- Implements password strength checking
- Provides secure password generation

### API Reference

#### `password.hash(plaintext: string, options?: HashOptions): Promise<string>`

Hashes a password securely.

- `plaintext`: The password to hash
- `options` (optional): Hashing configuration options
- Returns: Promise resolving to the hashed password

#### `password.verify(plaintext: string, hash: string): Promise<boolean>`

Verifies a password against a hash.

- `plaintext`: The password to verify
- `hash`: The hashed password to compare against
- Returns: Promise resolving to `true` if matched, `false` otherwise

#### `password.generate(options?: PasswordGenerateOptions): string`

Generates a secure random password.

- `options` (optional): Password generation options
- Returns: A secure random password string

## Session Module Details

### Features

- JWT-based token generation and validation
- Refresh token rotation
- Session expiration and revocation

### API Reference

#### `session.create(options: CreateSessionOptions): Promise<SessionTokens>`

Creates a new session with access and refresh tokens.

- `options`: Session creation options
- Returns: Promise resolving to access and refresh tokens

#### `session.validate(token: string): Promise<TokenPayload | null>`

Validates a session token.

- `token`: The token to validate
- Returns: Promise resolving to the token payload if valid, null otherwise

#### `session.refresh(refreshToken: string): Promise<SessionTokens | null>`

Refreshes a session using a refresh token.

- `refreshToken`: The refresh token
- Returns: Promise resolving to new tokens if valid, null otherwise

## Integration Examples

### Express.js Two-Factor Authentication

```typescript
import express from 'express';
import { totp, password } from '@tesseract/utils';

const app = express();
app.use(express.json());

// Setup 2FA for a user
app.post('/setup-2fa', async (req, res) => {
  const { userId } = req.body;
  
  // Generate a new secret
  const secret = totp.generateSecret();
  
  // Save to user record in database
  // await saveSecretToUser(userId, secret);
  
  // Generate URI for QR code
  const uri = totp.generateUri(secret, 'user@example.com', 'YourApp');
  
  res.json({ 
    secret,
    uri
  });
});

// Verify and enable 2FA
app.post('/verify-2fa', async (req, res) => {
  const { userId, token } = req.body;
  
  // Get user's secret from database
  // const secret = await getUserSecret(userId);
  const secret = 'JBSWY3DPEHPK3PXP'; // Example
  
  if (totp.verify(secret, token)) {
    // Enable 2FA for the user
    // await enableTwoFactorForUser(userId);
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid code' });
  }
});

// User registration with password hashing
app.post('/register', async (req, res) => {
  const { email, plainPassword } = req.body;
  
  // Hash the password
  const hashedPassword = await password.hash(plainPassword);
  
  // Save user to database
  // await createUser({ email, password: hashedPassword });
  
  res.json({ success: true });
});

app.listen(3000);
```

## Credits

This package was developed in-house by the Tesseract team to provide authentication and security utilities tailored to our specific requirements.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 