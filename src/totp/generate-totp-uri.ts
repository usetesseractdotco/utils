import type { TOTPOptions } from './types'

/**
 * Generate TOTP URI for QR codes
 *
 * @param secret - Base32 encoded secret
 * @param accountName - User's account name (e.g. email)
 * @param issuer - Service name/issuer
 * @returns URI string that can be encoded in a QR code
 */
export function generateTOTPUri({
  secret,
  accountName,
  issuer,
  options,
}: {
  secret: string
  accountName: string
  issuer: string
  options?: TOTPOptions
}): string {
  const { algorithm = 'sha256', digits = 6, period = 30 } = options || {}

  const encodedIssuer = encodeURIComponent(issuer)
  const encodedAccount = encodeURIComponent(accountName)
  const encodedSecret = encodeURIComponent(secret)

  // Always include algorithm, digits, and period explicitly
  // This ensures compatibility with all authenticator apps
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${encodedSecret}&issuer=${encodedIssuer}&algorithm=${algorithm.toUpperCase()}&digits=${digits}&period=${period}`
}
