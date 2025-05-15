import type Redis from 'ioredis'

export async function clearCache(redisClient: Redis): Promise<void> {
  await redisClient.flushall()
}
