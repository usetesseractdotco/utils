import type Redis from 'ioredis'

import { clearCache } from './cache/clear-cache'
import { deleteCache } from './cache/delete-cache'
import { getCache } from './cache/get-cache'
import { setCache } from './cache/set-cache'
import { comparePassword } from './password/compare-password'
import { hashPassword } from './password/hash-password'
import { passwordSchema } from './password/schema'

export const defineTesseractUtils = (redisClient: Redis) => {
  return {
    cache: {
      set: (key: string, value: string, ttl: number) =>
        setCache(key, value, ttl, redisClient),
      get: (key: string) => getCache(key, redisClient),
      delete: (key: string) => deleteCache(key, redisClient),
      clear: () => clearCache(redisClient),
    },
    password: {
      hash: (password: string) => hashPassword(password),
      compare: (password: string, hashedPassword: string) =>
        comparePassword(password, hashedPassword),
      schema: passwordSchema,
    },
  }
}
