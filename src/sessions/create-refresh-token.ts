import * as jose from 'jose'

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
