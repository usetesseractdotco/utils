import { createAccessToken } from './create-access-token'
import { createRefreshToken } from './create-refresh-token'

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
