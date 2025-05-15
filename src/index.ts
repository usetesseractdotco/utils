import type Redis from 'ioredis'

import { error, success } from './api-response'
import { clearCache } from './cache/clear-cache'
import { deleteCache } from './cache/delete-cache'
import { getCache } from './cache/get-cache'
import { setCache } from './cache/set-cache'
import { comparePassword } from './password/compare-password'
import { hashPassword } from './password/hash-password'
import { passwordSchema } from './password/schema'
import { createSession } from './sessions/create-sesion'
import { verifySession } from './sessions/verify-session'

export const defineTesseractUtils = ({
  cache: { redisClient },
  password: { saltRounds },
  sessions: {
    secretKey,
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
    maxTokenAge,
  },
}: {
  cache: { redisClient: Redis }
  password: { saltRounds?: number }
  sessions: {
    secretKey: string
    accessTokenExpiresIn: string
    refreshTokenExpiresIn: string
    maxTokenAge: number
  }
}) => {
  return {
    cache: {
      set: (key: string, value: string, ttl: number) =>
        setCache(key, value, ttl, redisClient),
      get: (key: string) => getCache(key, redisClient),
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
      create: (userId: string, sessionId: string) =>
        createSession({
          userId,
          sessionId,
          secretKey,
          accessTokenExpiresIn,
          refreshTokenExpiresIn,
        }),
      verify: (accessToken: string, refreshToken: string) =>
        verifySession({
          accessToken,
          refreshToken,
          secretKey,
          maxTokenAge,
        }),
    },
    apiResponse: {
      success: <T>(data: T) => success({ data }),
      error: <T>(message: T) => error({ message }),
    },
  }
}
