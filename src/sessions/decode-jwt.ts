import * as jose from 'jose'

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
