import crypto from 'crypto'

/**
 * Encrypts data using AES-256-GCM
 *
 * @param data - The data to encrypt
 * @param secretKey - The secret key for encryption
 * @returns Encrypted data as a string (IV + auth tag + encrypted data)
 */
export function encrypt(data: string, secretKey: string): string {
  // Create a buffer from the secret key (use SHA-256 to ensure correct length)
  const key = crypto.createHash('sha256').update(secretKey).digest()

  // Generate a random initialization vector
  const iv = crypto.randomBytes(16)

  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  // Get the auth tag
  const authTag = cipher.getAuthTag().toString('hex')

  // Return IV + auth tag + encrypted data
  return iv.toString('hex') + ':' + authTag + ':' + encrypted
}
