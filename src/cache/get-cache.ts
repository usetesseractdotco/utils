import type Redis from 'ioredis'

/**
 * Retrieves and deserializes a value from the Redis cache.
 *
 * @template T - The type of the cached data
 * @param {string} key - The key to retrieve from the cache
 * @param {Redis} redisClient - The Redis client instance to use
 * @returns {Promise<T | null>} A promise that resolves with the deserialized cached data, or null if not found
 */
export const getCache = async <T>(
  key: string,
  redisClient: Redis,
): Promise<T | null> => {
  const cachedData = await redisClient.get(key)

  return cachedData ? (JSON.parse(cachedData) as T) : null
}
