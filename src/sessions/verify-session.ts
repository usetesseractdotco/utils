import * as jose from 'jose'

type Payload = {
  sub: string
  jti: string
}

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
