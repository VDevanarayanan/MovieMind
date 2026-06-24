import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;
let isRedisConnected = false;

// Local fallback cache
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

export const initCache = async () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  console.log(`[Cache] Initializing Redis client at ${redisUrl}...`);
  
  redisClient = createClient({ url: redisUrl });

  redisClient.on('error', (err) => {
    // Suppress spamming connection error logs
    if (isRedisConnected) {
      console.warn('[Cache] Redis connection lost, falling back to in-memory cache:', err.message);
    }
    isRedisConnected = false;
  });

  redisClient.on('connect', () => {
    console.log('[Cache] Redis client connecting...');
  });

  redisClient.on('ready', () => {
    console.log('[Cache] Redis client connected and ready.');
    isRedisConnected = true;
  });

  try {
    // Attempt to connect with a short timeout to prevent blocking application startup
    await Promise.race([
      redisClient.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connection timeout')), 2500))
    ]);
  } catch (err: any) {
    console.warn(`[Cache] Redis connection failed (${err.message}). Using in-memory fallback cache.`);
    isRedisConnected = false;
  }
};

export const getCache = async (key: string): Promise<any | null> => {
  if (isRedisConnected && redisClient) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (e: any) {
      console.warn(`[Cache] Redis get error for key ${key}:`, e.message);
    }
  }

  // Fallback to in-memory cache
  const cached = memoryCache.get(key);
  if (cached) {
    if (Date.now() < cached.expiresAt) {
      return cached.value;
    } else {
      memoryCache.delete(key);
    }
  }
  return null;
};

export const setCache = async (key: string, value: any, ttlSeconds: number): Promise<void> => {
  if (isRedisConnected && redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
      return;
    } catch (e: any) {
      console.warn(`[Cache] Redis set error for key ${key}:`, e.message);
    }
  }

  // Fallback to in-memory cache
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};
