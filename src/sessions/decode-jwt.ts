import * as jose from 'jose'

/**
 * Decodes and validates a JWT token without verifying its signature.
 *
 * @param {string} token - The JWT token to decode
 * @returns {Promise<{decodedToken: jose.JWTPayload & { jti: string; sub: string }}>} Object containing the decoded token payload
 * @throws {Error} If the token is invalid or missing required fields
 */
export async function decodeJWT(token: string) {
  const decoded = jose.decodeJwt(token)

  if (
    !decoded ||
    typeof decoded.sub !== 'string' ||
    typeof decoded.jti !== 'string'
  ) {
    throw new Error('Invalid token')
  }

  return {
    decodedToken: decoded as jose.JWTPayload & { jti: string; sub: string },
  }
}
