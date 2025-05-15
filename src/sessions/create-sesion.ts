import { createAccessToken } from './create-access-token'
import { createRefreshToken } from './create-refresh-token'

/**
 * Creates a new session with both access and refresh tokens.
 *
 * @param {Object} options - The session creation options
 * @param {string} options.userId - The ID of the user for whom the session is created
 * @param {string} options.sessionId - Unique identifier for this specific session
 * @param {string} options.secretKey - Secret key used to sign the JWT tokens
 * @param {string} options.accessTokenExpiresIn - Expiration time for the access token (e.g. '15m')
 * @param {string} options.refreshTokenExpiresIn - Expiration time for the refresh token (e.g. '7d')
 * @returns {Promise<{accessToken: string, refreshToken: string}>} The generated tokens for the session
 */
export async function createSession({
  userId,
  sessionId,
  secretKey,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
}: {
  userId: string
  sessionId: string
  secretKey: string
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
}) {
  const { accessToken } = await createAccessToken({
    userId,
    sessionId,
    secretKey,
    accessTokenExpiresIn,
  })

  const { refreshToken } = await createRefreshToken({
    userId,
    sessionId,
    secretKey,
    refreshTokenExpiresIn,
  })

  return {
    accessToken,
    refreshToken,
  }
}
