import crypto from 'crypto'

/**
 * Decrypts data encrypted with the encrypt function
 *
 * @param encryptedData - The encrypted data string (IV + auth tag + encrypted data)
 * @param secretKey - The secret key used for encryption
 * @returns Decrypted data as a string
 */
export function decrypt(encryptedData: string, secretKey: string): string {
  try {
    // Create a buffer from the secret key (use SHA-256 to ensure correct length)
    const key = crypto.createHash('sha256').update(secretKey).digest()

    // Split the encrypted data into IV, auth tag, and encrypted parts
    const parts = encryptedData.split(':')

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format')
    }

    const [ivHex, authTagHex, encrypted] = parts

    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid encrypted data format')
    }

    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')

    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)

    // Set auth tag
    decipher.setAuthTag(authTag)

    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    throw new Error(
      `Decryption failed: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
