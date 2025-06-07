/**
 * @module src/features/auth/lib/rate-limit
 * Provides rate limiting functionality for authentication and sign-up processes.
 * This module utilizes `rate-limiter-flexible` with a shared `ioredis` client instance
 * imported from `../../../lib/feature-flags.ts`.
 * Rate limits are applied per IP address to prevent abuse of authentication endpoints.
 */

import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from '../../../lib/feature-flags';

/**
 * Rate limiter for general authentication actions, such as sign-in attempts.
 *
 * Configuration:
 * - Allows up to 5 requests per IP address within a 15-minute window.
 * - If the limit is exceeded, subsequent requests from the same IP will be blocked
 *   until the window resets.
 *
 * Implementation:
 * - Uses `RateLimiterRedis` from the `rate-limiter-flexible` library.
 * - Keys in Redis are prefixed with `ratelimit:auth`.
 */
export const authRateLimit = new RateLimiterRedis({
  storeClient: redisClient,
  points: 5, // Max 5 requests
  duration: 15 * 60, // Per 15 minutes (in seconds)
  keyPrefix: 'ratelimit:auth',
});

/**
 * Rate limiter specifically for sign-up actions.
 * This is stricter than the general authentication rate limiter to prevent mass account creation.
 *
 * Configuration:
 * - Allows 1 sign-up attempt per IP address within a 15-minute window.
 *
 * Implementation:
 * - Uses `RateLimiterRedis` from the `rate-limiter-flexible` library.
 * - Keys in Redis are prefixed with `ratelimit:signup`.
 */
export const signUpRateLimit = new RateLimiterRedis({
  storeClient: redisClient,
  points: 1, // Max 1 request
  duration: 15 * 60, // Per 15 minutes (in seconds)
  keyPrefix: 'ratelimit:signup',
});
