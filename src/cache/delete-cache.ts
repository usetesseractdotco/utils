import type Redis from 'ioredis'

/**
 * Deletes a specific key from the Redis cache.
 *
 * @param {string} key - The key to delete from the cache
 * @param {Redis} redisClient - The Redis client instance to use
 * @returns {Promise<void>} A promise that resolves when the key is deleted
 */
export const deleteCache = async (key: string, redisClient: Redis) => {
  await redisClient.del(key)
}
