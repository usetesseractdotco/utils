import type Redis from 'ioredis'

import { clearCache } from './cache/clear-cache'
import { deleteCache } from './cache/delete-cache'
import { getCache } from './cache/get-cache'
import { setCache } from './cache/set-cache'

export const defineTesseractUtils = (redisClient: Redis) => {
  return {
    cache: {
      setCache: (key: string, value: string, ttl: number) =>
        setCache(key, value, ttl, redisClient),
      getCache: (key: string) => getCache(key, redisClient),
      deleteCache: (key: string) => deleteCache(key, redisClient),
      clearCache: () => clearCache(redisClient),
    },
  }
}
