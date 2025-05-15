import type Redis from 'ioredis'

export const getCache = async <T>(
  key: string,
  redisClient: Redis,
): Promise<T | null> => {
  const cachedData = await redisClient.get(key)

  return cachedData ? (JSON.parse(cachedData) as T) : null
}
