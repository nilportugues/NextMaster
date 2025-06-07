// Mock the Redis client from feature-flags.ts
// This is the shared ioredis client instance.
const mockRedisClientInstance = {
  on: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  // Add any other methods that ioredis client might use or that RateLimiterRedis might expect.
  // For RateLimiterRedis, it primarily needs Redis command methods like 'eval', 'hset', 'hincrby', etc.
  // However, RateLimiterRedis itself usually handles the actual command execution.
  // For testing constructor arguments, a simple object mock might suffice.
  // If RateLimiterRedis performs checks on the client, more methods might need to be mocked.
  status: 'ready', // Some properties might be accessed
};

jest.mock('../../../lib/feature-flags', () => ({
  __esModule: true, // For ES modules
  default: mockRedisClientInstance, // Assuming redisClient is the default export from feature-flags
}));

// Mock RateLimiterRedis from rate-limiter-flexible
const mockRateLimiterRedisConstructor = jest.fn();
jest.mock('rate-limiter-flexible', () => ({
  // __esModule: true, // Not always needed for cjs modules like rate-limiter-flexible might be
  RateLimiterRedis: mockRateLimiterRedisConstructor,
}));

// Import the module to be tested *after* mocks are defined.
// Jest's hoisting should handle this with ES6 imports, but if not,
// we might need to use require() inside beforeEach or use jest.resetModules().
import { authRateLimit, signUpRateLimit } from './rate-limit';

describe('Rate Limiter Configuration (rate-limit.ts)', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockRateLimiterRedisConstructor.mockClear();
    mockRedisClientInstance.on.mockClear();
    mockRedisClientInstance.connect.mockClear();
  });

  describe('authRateLimit', () => {
    it('should be created using RateLimiterRedis', () => {
      // The constants authRateLimit and signUpRateLimit are instances created when rate-limit.ts is imported.
      // We need to check that the constructor was called.
      // Since the module is imported once, the constructor is called once per limiter.
      // We expect at least one call for authRateLimit.
      expect(mockRateLimiterRedisConstructor).toHaveBeenCalled();
    });

    it('should be configured with correct options for authRateLimit', () => {
      const expectedAuthOptions = {
        storeClient: mockRedisClientInstance,
        points: 5,
        duration: 15 * 60, // 900
        keyPrefix: 'ratelimit:auth',
      };

      // Check if the constructor was called with options matching authRateLimit's config
      expect(mockRateLimiterRedisConstructor).toHaveBeenCalledWith(
        expect.objectContaining(expectedAuthOptions)
      );
    });
  });

  describe('signUpRateLimit', () => {
    it('should be created using RateLimiterRedis', () => {
      // Similar to authRateLimit, just ensuring the constructor was involved.
      // The total calls to the constructor by the time the module is loaded should be 2.
      expect(mockRateLimiterRedisConstructor).toHaveBeenCalledTimes(2); // One for auth, one for signup
    });

    it('should be configured with correct options for signUpRateLimit', () => {
      const expectedSignUpOptions = {
        storeClient: mockRedisClientInstance,
        points: 1,
        duration: 15 * 60, // 900
        keyPrefix: 'ratelimit:signup',
      };

      // Check if the constructor was called with options matching signUpRateLimit's config
      expect(mockRateLimiterRedisConstructor).toHaveBeenCalledWith(
        expect.objectContaining(expectedSignUpOptions)
      );
    });
  });

  it('should use the same redis client instance for both limiters', () => {
    // Ensure both calls to RateLimiterRedis constructor used the same storeClient
    const calls = mockRateLimiterRedisConstructor.mock.calls;
    expect(calls.length).toBe(2); // Assuming both were instantiated
    if (calls.length === 2) {
      expect(calls[0][0].storeClient).toBe(mockRedisClientInstance);
      expect(calls[1][0].storeClient).toBe(mockRedisClientInstance);
    }
  });
});

// To ensure the variables are actually exported and are instances (even if mocked)
describe('Exports from rate-limit.ts', () => {
  it('should export authRateLimit', () => {
    expect(authRateLimit).toBeDefined();
  });

  it('should export signUpRateLimit', () => {
    expect(signUpRateLimit).toBeDefined();
  });
});
