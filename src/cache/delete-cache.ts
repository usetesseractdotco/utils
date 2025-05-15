import type Redis from 'ioredis'

export const deleteCache = async (key: string, redisClient: Redis) => {
  await redisClient.del(key)
}
