import { type Redis } from 'ioredis'

/**
 * Sets a value in the Redis cache with an expiration time.
 *
 * @param {string} key - The key to set in the cache
 * @param {string} value - The value to store in the cache
 * @param {number} ttl - Time to live in seconds
 * @param {Redis} redisClient - The Redis client instance to use
 * @returns {Promise<void>} A promise that resolves when the value is set
 */
export const setCache = async (
  key: string,
  value: string,
  ttl: number,
  redisClient: Redis,
) => {
  await redisClient.set(key, value, 'EX', ttl)
}
