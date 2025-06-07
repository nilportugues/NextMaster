import Redis from 'ioredis';

// Define a Redis connection URL. Use process.env.REDIS_URL if available, otherwise default to redis://redis:6379.
const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

// Instantiate a Redis client.
// The client will attempt to reconnect automatically by default.
const redisClient = new Redis(redisUrl, {
  // Optional: Add connection timeout to prevent hanging if Redis is completely unavailable
  // connectTimeout: 5000, // 5 seconds
  // Optional: Configure retry strategy if needed, though default is often sufficient
  // retryStrategy(times) {
  //   const delay = Math.min(times * 50, 2000); // Default retry strategy
  //   return delay;
  // },
});

redisClient.on('connect', () => {
  console.log('Successfully connected to Redis for feature flags.');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error for feature flags:', err);
  // ioredis will attempt to reconnect automatically.
  // No need to throw or exit here unless specific handling for initial connection failure is required.
});

/**
 * Checks if a feature is enabled by querying its state in Redis.
 * @param featureName The name of the feature to check.
 * @returns A promise that resolves to true if the feature is enabled, false otherwise.
 */
export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  const key = `feature:${featureName}`;
  try {
    const value = await redisClient.get(key);
    // If the value returned is exactly the string "true", return true.
    // Otherwise (value is null, or any other string), return false.
    return value === 'true';
  } catch (error) {
    console.error(`Error fetching feature flag '${featureName}' from Redis:`, error);
    // If an error occurs during the get operation, log the error and return false.
    return false;
  }
}

// Optional: Graceful shutdown for the Redis client if the application supports it.
// This is more relevant for standalone Node.js applications than Next.js in some deployment models.
// async function shutdownRedis() {
//   await redisClient.quit();
//   console.log('Redis client disconnected for feature flags.');
// }
// process.on('SIGINT', shutdownRedis);
// process.on('SIGTERM', shutdownRedis);

export default redisClient; // Exporting the client itself might be useful for other Redis operations or for testing.
