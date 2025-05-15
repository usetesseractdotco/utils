import type Redis from 'ioredis'

/**
 * Clears all keys from the Redis cache.
 *
 * @param {Redis} redisClient - The Redis client instance to use
 * @returns {Promise<void>} A promise that resolves when the cache is cleared
 */
export async function clearCache(redisClient: Redis): Promise<void> {
  await redisClient.flushall()
}
