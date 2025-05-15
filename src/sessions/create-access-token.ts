import * as jose from 'jose'

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
