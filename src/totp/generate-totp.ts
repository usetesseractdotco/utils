import crypto from 'crypto'

import { base32Decode } from './base-32-decode'
import type { TOTPOptions } from './types'

/**
 * Generate TOTP token for a specific counter value
 *
 * @param secret - Base32 encoded secret
 * @param counter - Counter value (default: current time period)
 * @param options - TOTP options (default: sha256, 6 digits, 30 seconds period)
 * @returns N-digit TOTP code (where N is specified in enforced options)
 */
export function generateTOTP({
  secret,
  counter,
  options,
}: {
  secret: string
  counter?: number
  options?: TOTPOptions
}): string {
  const { algorithm = 'sha256', digits = 6, period = 30 } = options || {}
  // Use current time counter if not provided
  const currentCounter = counter ?? Math.floor(Date.now() / 1000 / period)

  // Decode the base32 secret
  const buffer = base32Decode({ input: secret })

  // Convert counter to buffer
  const counterBuffer = Buffer.alloc(8)
  let tempCounter = currentCounter
  for (let i = 0; i < 8; i++) {
    counterBuffer[7 - i] = tempCounter & 0xff
    tempCounter = tempCounter >> 8
  }

  // Create HMAC using the specified algorithm
  const hmac = crypto.createHmac(algorithm, buffer)
  hmac.update(counterBuffer)
  const hmacResult = hmac.digest()

  // Get offset based on last 4 bits of the hash
  const lastByte = hmacResult[hmacResult.length - 1]
  if (lastByte === undefined) {
    return '0'.repeat(digits) // Fallback in case of unexpected errors
  }

  const offset = lastByte & 0xf

  // Ensure we have enough bytes to extract the code
  if (offset + 3 >= hmacResult.length) {
    return '0'.repeat(digits) // Fallback in case of unexpected errors
  }

  // Get the 4 bytes starting at offset
  const byte1 = hmacResult[offset] ?? 0
  const byte2 = hmacResult[offset + 1] ?? 0
  const byte3 = hmacResult[offset + 2] ?? 0
  const byte4 = hmacResult[offset + 3] ?? 0

  // Calculate code
  let code =
    ((byte1 & 0x7f) << 24) |
    ((byte2 & 0xff) << 16) |
    ((byte3 & 0xff) << 8) |
    (byte4 & 0xff)

  // Generate N-digit code
  code = code % Math.pow(10, digits)

  // Pad with leading zeros if needed
  return code.toString().padStart(digits, '0')
}
