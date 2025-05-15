import * as jose from 'jose'

/**
 * Creates a JWT refresh token for session renewal.
 *
 * @param {Object} options - The token creation options
 * @param {string} options.userId - The ID of the user for whom the token is created
 * @param {string} options.sessionId - The session ID to include in the token
 * @param {string} options.secretKey - The secret key to sign the JWT
 * @param {string} options.refreshTokenExpiresIn - Expiration time for the token (e.g. '7d')
 * @returns {Promise<{refreshToken: string}>} Object containing the generated refresh token
 */
export async function createRefreshToken({
  userId,
  sessionId,
  secretKey,
  refreshTokenExpiresIn,
}: {
  userId: string
  sessionId: string
  secretKey: string
  refreshTokenExpiresIn: string
}) {
  const encodedSecretKey = new TextEncoder().encode(secretKey)

  const refreshToken = await new jose.SignJWT({
    sub: userId,
    jti: sessionId,
  })
    .setIssuedAt()
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(refreshTokenExpiresIn)
    .sign(encodedSecretKey)

  return { refreshToken }
}
