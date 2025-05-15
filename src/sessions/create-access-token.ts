import * as jose from 'jose'

/**
 * Creates a JWT access token for user authentication.
 *
 * @param {Object} options - The token creation options
 * @param {string} options.userId - The ID of the user for whom the token is created
 * @param {string} options.sessionId - The session ID to include in the token
 * @param {string} options.secretKey - The secret key to sign the JWT
 * @param {string} options.accessTokenExpiresIn - Expiration time for the token (e.g. '15m')
 * @returns {Promise<{accessToken: string}>} Object containing the generated access token
 */
export async function createAccessToken({
  userId,
  sessionId,
  secretKey,
  accessTokenExpiresIn,
}: {
  userId: string
  sessionId: string
  secretKey: string
  accessTokenExpiresIn: string
}) {
  const encodedSecretKey = new TextEncoder().encode(secretKey)

  const accessToken = await new jose.SignJWT({
    sub: userId,
    jti: sessionId,
  })
    .setIssuedAt()
    .setExpirationTime(accessTokenExpiresIn)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .sign(encodedSecretKey)

  return { accessToken }
}
