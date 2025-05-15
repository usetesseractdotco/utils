import crypto from 'crypto'

import { base32Encode } from './base-32-encode'

/**
 * Generates a random Base32 secret key for TOTP
 *
 * @param length - Length of the secret (default: 20 bytes)
 * @returns Base32 encoded secret compatible with authenticator apps
 */
export function generateTOTPSecret({
  length = 20,
}: {
  length?: number
}): string {
  const randomBuffer = crypto.randomBytes(length)
  return base32Encode({ buffer: randomBuffer })
}
