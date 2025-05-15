import * as jose from 'jose'

/**
 * Represents the payload structure of a JWT token.
 *
 * @typedef {Object} Payload
 * @property {string} sub - Subject of the token (typically the user ID)
 * @property {string} jti - JWT ID (typically the session ID)
 */
type Payload = {
  sub: string
  jti: string
}

/**
 * Verifies both access and refresh tokens to validate a session.
 *
 * @param {Object} options - The verification options
 * @param {string} options.accessToken - The access token to verify
 * @param {string} options.refreshToken - The refresh token to verify
 * @param {string} options.secretKey - The secret key used to sign the tokens
 * @param {number} options.maxTokenAge - Maximum allowed token age in milliseconds
 * @returns {Promise<{accessTokenPayload: Payload, refreshTokenPayload: Payload}>} The decoded payloads from both tokens
 * @throws {Error} If token validation fails or tokens don't match
 */
export async function verifySession({
  accessToken,
  refreshToken,
  secretKey,
  maxTokenAge,
}: {
  accessToken: string
  refreshToken: string
  secretKey: string
  maxTokenAge: number
}) {
  const encodedSecretKey = new TextEncoder().encode(secretKey)

  const { payload: accessTokenPayload }: { payload: Payload } =
    await jose.jwtVerify(accessToken, encodedSecretKey, {
      algorithms: ['HS256'],
      typ: 'JWT',
      maxTokenAge: maxTokenAge / 1000, // in seconds
    })

  const { payload: refreshTokenPayload }: { payload: Payload } =
    await jose.jwtVerify(refreshToken, encodedSecretKey, {
      algorithms: ['HS256'],
      typ: 'JWT',
      maxTokenAge: maxTokenAge / 1000, // in seconds
    })

  if (
    !refreshTokenPayload.sub ||
    !refreshTokenPayload.jti ||
    !accessTokenPayload.sub ||
    !accessTokenPayload.jti ||
    refreshTokenPayload.sub !== accessTokenPayload.sub
  ) {
    throw new Error('Unauthorized')
  }

  return {
    accessTokenPayload,
    refreshTokenPayload,
  }
}
