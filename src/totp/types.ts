/**
 * TOTP Configuration options
 *
 * Note: These parameters are included for compatibility, but our implementation
 * enforces SHA-256, 6 digits, and 30-second period for security.
 */
export interface TOTPOptions {
  /**
   * The issuer of the TOTP code
   */
  issuer?: string

  /**
   * The account name of the TOTP code
   */
  accountName?: string

  /**
   * Number of digits in the generated TOTP code
   * @default 6
   */
  digits?: 6 | 8

  /**
   * Time period in seconds for which a TOTP code is valid
   * @default 30
   */
  period?: number

  /**
   * Algorithm to use for HMAC
   * @default "sha256"
   */
  algorithm?: 'sha1' | 'sha256' | 'sha512'
}
