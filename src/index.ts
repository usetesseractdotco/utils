import type Redis from 'ioredis'

import { clearCache } from './cache/clear-cache'
import { deleteCache } from './cache/delete-cache'
import { getCache } from './cache/get-cache'
import { setCache } from './cache/set-cache'
import { decrypt, encrypt, randomString } from './crypto'
import { comparePassword } from './password/compare-password'
import { hashPassword } from './password/hash-password'
import { passwordSchema } from './password/schema'
import { error, success } from './response'
import { createRefreshToken } from './sessions/create-refresh-token'
import { createSession } from './sessions/create-sesion'
import { verifySession } from './sessions/verify-session'
import { generateTOTP } from './totp/generate-totp'
import { generateTOTPQRCode } from './totp/generate-totp-qr-code'
import { generateTOTPSecret } from './totp/generate-totp-secret'
import { generateTOTPUri } from './totp/generate-totp-uri'
import type { TOTPOptions } from './totp/types'
import { verifyTOTP } from './totp/verify-totp'

export const defineTesseractUtils = ({
  cache: { redisClient },
  password: { saltRounds },
  sessions: {
    secretKey,
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
    maxAccessTokenAge,
    maxRefreshTokenAge,
  },
  totp: { issuer, accountName, algorithm, digits, period },
}: {
  cache: { redisClient: Redis }
  password: { saltRounds?: number }
  sessions: {
    secretKey: string
    accessTokenExpiresIn: string
    refreshTokenExpiresIn: string
    maxAccessTokenAge: number
    maxRefreshTokenAge: number
  }
  totp: TOTPOptions
}) => {
  return {
    cache: {
      set: (key: string, value: string, ttl: number) =>
        setCache(key, value, ttl, redisClient),
      get: <T>(key: string) => getCache<T>(key, redisClient),

      delete: (key: string) => deleteCache(key, redisClient),
      clear: () => clearCache(redisClient),
    },
    password: {
      hash: (password: string) => hashPassword(password, saltRounds),
      compare: (password: string, hashedPassword: string) =>
        comparePassword(password, hashedPassword),
      schema: passwordSchema,
    },
    sessions: {
      create: ({ userId, sessionId }: { userId: string; sessionId: string }) =>
        createSession({
          userId,
          sessionId,
          secretKey,
          accessTokenExpiresIn,
          refreshTokenExpiresIn,
        }),
      verify: ({
        accessToken,
        refreshToken,
      }: {
        accessToken: string
        refreshToken: string
      }) =>
        verifySession({
          accessToken,
          refreshToken,
          secretKey,
          maxAccessTokenAge,
          maxRefreshTokenAge,
        }),
      refresh: ({ userId, sessionId }: { userId: string; sessionId: string }) =>
        createRefreshToken({
          userId,
          sessionId,
          secretKey,
          refreshTokenExpiresIn,
        }),
    },
    response: {
      success: <T>({ data, code }: { data: T; code?: number }) =>
        success({ data, code }),
      error: <T>({ message, code }: { message: T; code?: number }) =>
        error({ message, code }),
    },
    crypto: {
      encrypt: (data: string, secretKey: string) => encrypt(data, secretKey),
      decrypt: (encryptedData: string, secretKey: string) =>
        decrypt(encryptedData, secretKey),
      randomString: (length: number) => randomString(length),
    },
    totp: {
      generateSecret: ({ length }: { length?: number } = {}) =>
        generateTOTPSecret({ length }),
      generate: ({ secret, counter }: { secret: string; counter?: number }) =>
        generateTOTP({
          secret,
          counter,
          options: {
            accountName,
            algorithm,
            digits,
            issuer,
            period,
          },
        }),
      verify: ({
        secret,
        token,
        window,
      }: {
        secret: string
        token: string
        window?: number
      }) =>
        verifyTOTP({
          secret,
          token,
          window,
          options: {
            accountName,
            algorithm,
            digits,
            issuer,
            period,
          },
        }),
      generateUri: ({
        secret,
        accountName,
        issuer,
      }: {
        secret: string
        accountName: string
        issuer: string
      }) =>
        generateTOTPUri({
          secret,
          accountName,
          issuer,
          options: {
            accountName,
            algorithm,
            digits,
            issuer,
            period,
          },
        }),
      generateQRCode: ({
        secret,
        accountName,
        qrOptions,
      }: {
        secret: string
        accountName: string
        qrOptions: {
          errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
          margin: number
          size: number
        }
      }) =>
        generateTOTPQRCode({
          secret,
          accountName,
          issuer: issuer || 'Tesseract',
          qrOptions,
          options: {
            accountName,
            algorithm,
            digits,
            period,
          },
        }),
    },
  }
}
