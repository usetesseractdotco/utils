import { type Redis } from 'ioredis'

export const setCache = async (
  key: string,
  value: string,
  ttl: number,
  redisClient: Redis,
) => {
  await redisClient.set(key, value, 'EX', ttl)
}
