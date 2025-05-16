# @usetesseract/utils

A comprehensive collection of secure utilities for Node.js backend applications. This package provides battle-tested implementations for common backend functionality including authentication, security, and data handling.

This package is an in-house utility library developed by Tesseract to provide flexible and reliable utilities specifically for our backend services.

## Features

- **Security Focused**: Implements security best practices by default
- **Modular Design**: Use only what you need with tree-shakable imports
- **Comprehensive**: Covers common backend utility needs in one package
- **TypeScript**: Fully typed API with detailed documentation
- **Configurable**: Sensible defaults with customization options

## Installation

```bash
npm install @usetesseract/utils
# or
yarn add @usetesseract/utils
# or
bun add @usetesseract/utils
```

## Usage

First, initialize the utilities with your configuration:

```typescript
import { defineTesseractUtils } from '@usetesseract/utils';
import Redis from 'ioredis';

// Create a Redis client
const redisClient = new Redis();

// Initialize the utilities
const utils = defineTesseractUtils({
  cache: { 
    redisClient 
  },
  password: { 
    saltRounds: 12 
  },
  sessions: {
    secretKey: process.env.SESSION_SECRET_KEY,
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
    maxTokenAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  }
});

// Now use the utils in your application
const { cache, password, sessions } = utils;
```

## Modules

### TOTP (Time-based One-Time Password)

Secure implementation of TOTP for two-factor authentication.

```typescript
// First initialize utils as shown in Usage section
const { totp } = utils;

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
// First initialize utils as shown in Usage section
const { password } = utils;

// Hash a password
const hashedPassword = await password.hash('user-password');

// Verify a password
const isValid = await password.compare('user-password', hashedPassword);

// Validate password against schema
const isValidFormat = password.schema.safeParse('user-password');
```

### Session Management

Utilities for handling user sessions securely.

```typescript
// First initialize utils as shown in Usage section
const { sessions } = utils;

// Create a new session
const { accessToken, refreshToken } = await sessions.create('user-123', 'session-456');

// Validate tokens
const sessionData = await sessions.verify(accessToken, refreshToken);
```

### Crypto Utilities

Encryption, decryption, and other cryptographic operations.

```typescript
// First initialize utils as shown in Usage section
const { crypto } = utils;

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
// First initialize utils as shown in Usage section
const { cache } = utils;

// Set a cache value
await cache.set('key', JSON.stringify({ data: 'value' }), 3600); // 1 hour TTL

// Get a cached value
const value = await cache.get('key');

// Delete from cache
await cache.delete('key');

// Clear the entire cache
await cache.clear();
```

### API Response Formatting

Consistent API response formatting.

```typescript
// First initialize utils as shown in Usage section
const { response } = utils;

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

- Uses bcrypt for secure password hashing
- Implements password strength checking with zod schema
- Configurable salt rounds for bcrypt

### API Reference

#### `password.hash(password: string): Promise<string>`

Hashes a password securely.

- `password`: The password to hash
- Returns: Promise resolving to the hashed password

#### `password.compare(password: string, hashedPassword: string): Promise<boolean>`

Verifies a password against a hash.

- `password`: The password to verify
- `hashedPassword`: The hashed password to compare against
- Returns: Promise resolving to `true` if matched, `false` otherwise

#### `password.schema`

A zod schema for validating password strength.

## Session Module Details

### Features

- JWT-based token generation and validation
- Access and refresh token handling
- Session expiration and validation

### API Reference

#### `sessions.create(userId: string, sessionId: string): Promise<{ accessToken: string, refreshToken: string }>`

Creates a new session with access and refresh tokens.

- `userId`: User identifier
- `sessionId`: Session identifier
- Returns: Promise resolving to access and refresh tokens

#### `sessions.verify(accessToken: string, refreshToken: string): Promise<Object | null>`

Validates session tokens.

- `accessToken`: The access token to validate
- `refreshToken`: The refresh token
- Returns: Promise resolving to the session data if valid, null otherwise

## Integration Examples

### Express.js User Authentication

```typescript
import express from 'express';
import { defineTesseractUtils } from '@usetesseract/utils';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

// Initialize utilities
const redisClient = new Redis();
const utils = defineTesseractUtils({
  cache: { redisClient },
  password: { saltRounds: 12 },
  sessions: {
    secretKey: 'your-secret-key',
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
    maxTokenAge: 7 * 24 * 60 * 60 * 1000,
  }
});

const { password, sessions } = utils;

// User registration 
app.post('/register', async (req, res) => {
  const { email, plainPassword } = req.body;
  
  // Hash the password
  const hashedPassword = await password.hash(plainPassword);
  
  // Save user to database (example)
  // await createUser({ email, password: hashedPassword });
  
  res.json({ success: true });
});

// User login
app.post('/login', async (req, res) => {
  const { email, password: plainPassword } = req.body;
  
  // Get user from database (example)
  // const user = await getUserByEmail(email);
  const user = { id: '123', password: 'hashed-password-here' }; // Example
  
  const isPasswordValid = await password.compare(plainPassword, user.password);
  
  if (isPasswordValid) {
    // Create session ID
    const sessionId = 'session-' + Date.now();
    
    // Create tokens
    const tokens = await sessions.create(user.id, sessionId);
    
    res.json({ success: true, ...tokens });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.listen(3000);
```

## Credits

This package was developed in-house by the Tesseract team to provide authentication and security utilities tailored to our specific requirements.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 