import crypto from 'crypto'

/**
 * Generates a cryptographically secure random string
 *
 * @param length - Length of the random string to generate
 * @returns Random string of specified length
 */
export function randomString(length: number): string {
  // Define character set (alphanumeric)
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  // Generate random bytes
  const randomBytes = crypto.randomBytes(length)

  let result = ''

  // Convert random bytes to characters from charset
  for (let i = 0; i < length; i++) {
    const byte = randomBytes[i]
    if (byte !== undefined) {
      const randomIndex = byte % charset.length
      result += charset.charAt(randomIndex)
    }
  }

  return result
}
