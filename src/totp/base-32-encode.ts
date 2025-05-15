/**
 * Base32 encoding implementation
 */
export function base32Encode({ buffer }: { buffer: Buffer }): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let result = ''
  let bits = 0
  let value = 0

  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i]
    if (byte === undefined) continue

    value = (value << 8) | byte
    bits += 8

    while (bits >= 5) {
      result += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    result += alphabet[(value << (5 - bits)) & 31]
  }

  return result
}
