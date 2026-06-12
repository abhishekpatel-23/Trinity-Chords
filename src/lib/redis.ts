import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL

if (!redisUrl) {
  console.warn('REDIS_URL is not set. Caching will be disabled.')
}

const redis = redisUrl ? new Redis(redisUrl) : null

export default redis

export async function getCachedData<T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number = 300): Promise<T> {
  if (!redis) {
    return fetcher()
  }

  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached) as T
  }

  const data = await fetcher()
  await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds)
  return data
}

export async function invalidateCache(pattern: string) {
  if (!redis) return
  
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}
