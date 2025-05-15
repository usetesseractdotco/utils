/**
 * Base32 decoding implementation
 */
export function base32Decode({ input }: { input: string }): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const cleanedInput = input.replace(/=+$/, '').toUpperCase()

  const length = Math.floor((cleanedInput.length * 5) / 8)
  const result = Buffer.alloc(length)

  let bits = 0
  let value = 0
  let index = 0

  for (let i = 0; i < cleanedInput.length; i++) {
    const char = cleanedInput.charAt(i)

    const charValue = alphabet.indexOf(char)

    if (charValue === -1) {
      continue // Skip non-alphabet characters
    }

    value = (value << 5) | charValue
    bits += 5

    if (bits >= 8) {
      result[index++] = (value >>> (bits - 8)) & 255
      bits -= 8
    }
  }

  return result
}
