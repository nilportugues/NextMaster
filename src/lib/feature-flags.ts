/**
 * This module provides a Redis-based feature flag system.
 *
 * Feature flags are simple boolean flags stored in Redis. To enable a feature,
 * set a key in Redis with the prefix `feature:` followed by the feature name,
 * and set its value to the string "true".
 * For example, to enable a feature named 'newCheckout', set the Redis key
 * 'feature:newCheckout' to "true".
 *
 * The Redis connection URL is configured via the `REDIS_URL` environment
 * variable. If `REDIS_URL` is not set, it defaults to `redis://redis:6379`.
 */
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
 * Checks if a specific feature is enabled by querying its state in Redis.
 *
 * To enable a feature, set a Redis key in the format `feature:<featureName>`
 * to the string value `"true"`. For example, for a feature named 'newDashboard',
 * the Redis key would be `feature:newDashboard`.
 *
 * @param featureName The name of the feature to check (e.g., 'newDashboard').
 * @returns A promise that resolves to `true` if the feature is enabled (i.e., the corresponding
 *          Redis key exists and its value is "true"), and `false` otherwise (key not found,
 *          value is not "true", or an error occurs).
 * @example
 * async function checkNewDashboard() {
 *   const newDashboardEnabled = await isFeatureEnabled('newDashboard');
 *   if (newDashboardEnabled) {
 *     console.log('New dashboard is enabled, rendering new UI...');
 *     // showNewDashboardUI();
 *   } else {
 *     console.log('New dashboard is disabled, rendering old UI...');
 *     // showOldDashboardUI();
 *   }
 * }
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
