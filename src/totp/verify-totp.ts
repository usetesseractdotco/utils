import { generateTOTP } from './generate-totp'
import type { TOTPOptions } from './types'

/**
 * Verifies a TOTP code against a secret
 *
 * @param secret - The base32 encoded secret
 * @param token - The token to verify
 * @param window - How many periods to check before/after current time (default: 1)
 * @returns Whether the token is valid
 */
export function verifyTOTP({
  secret,
  token,
  window = 1,
  options,
}: {
  secret: string
  token: string
  window?: number
  options?: TOTPOptions
}): boolean {
  const { digits = 6, period = 30 } = options || {}

  // Normalize token input - remove spaces and make uppercase
  const normalizedToken = token.replace(/\s+/g, '').toUpperCase()

  // Validate that the token has the correct number of digits
  const digitRegex = new RegExp(`^\\d{${digits}}$`)
  if (!digitRegex.test(normalizedToken)) {
    return false
  }

  // Get current counter value (floor(current seconds / period))
  const counter = Math.floor(Date.now() / 1000 / period)

  // Check tokens in time window
  for (let i = -window; i <= window; i++) {
    const calculatedToken = generateTOTP({
      secret,
      counter: counter + i,
    })
    if (calculatedToken === normalizedToken) {
      return true
    }
  }

  return false
}
