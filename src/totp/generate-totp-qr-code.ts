import QRCode from 'qrcode'

import { generateTOTPUri } from './generate-totp-uri'
import type { TOTPOptions } from './types'

/**
 * Generate a QR code data URL for TOTP authentication
 *
 * @param secret - Base32 encoded secret
 * @param accountName - User's account name (e.g. email)
 * @param issuer - Service name/issuer
 * @param qrOptions - QR code options (size, etc.)
 * @returns Promise that resolves to a data URL for the QR code
 */
export async function generateTOTPQRCode({
  secret,
  accountName,
  issuer,
  options,
  qrOptions = {},
}: {
  secret: string
  accountName: string
  issuer: string
  options?: TOTPOptions
  qrOptions?: {
    size?: number
    margin?: number
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  }
}): Promise<string> {
  // Generate the TOTP URI
  const uri = generateTOTPUri({ secret, accountName, issuer, options })

  // Dynamically import QRCode to avoid node.js/browser compatibility issues
  // This avoids bundling QRCode in environments where it's not needed
  // Default options
  const { size = 200, margin = 4, errorCorrectionLevel = 'M' } = qrOptions

  // Generate QR code as data URL
  return QRCode.toDataURL(uri, {
    width: size,
    margin,
    errorCorrectionLevel,
  })
}
