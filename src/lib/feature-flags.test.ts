// Import the function to test
import { isFeatureEnabled } from './feature-flags';

// Mock ioredis
const mockRedisGet = jest.fn();
const mockRedisOn = jest.fn();
const mockRedisConnect = jest.fn().mockResolvedValue(undefined); // Simulates successful connection

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: mockRedisGet,
      on: mockRedisOn, // Mock 'on' to prevent errors during client instantiation
      connect: mockRedisConnect, // Mock 'connect'
      // Add any other methods that might be called during initialization if necessary
    };
  });
});

// Mock console.error to spy on it for the error test case
let consoleErrorSpy: jest.SpyInstance;

describe('isFeatureEnabled', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockRedisGet.mockReset();
    mockRedisOn.mockReset(); // Though not strictly necessary for these tests, good practice
    mockRedisConnect.mockClear(); // Clear call counts etc.

    // Spy on console.error and provide a mock implementation to suppress actual logging during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error spy after each test
    consoleErrorSpy.mockRestore();
  });

  it('should return true when the feature flag is "true" in Redis', async () => {
    mockRedisGet.mockResolvedValue('true');
    const featureName = 'testFeatureEnabled';
    const result = await isFeatureEnabled(featureName);
    expect(result).toBe(true);
    expect(mockRedisGet).toHaveBeenCalledWith(`feature:${featureName}`);
  });

  it('should return false when the feature flag is "false" in Redis', async () => {
    mockRedisGet.mockResolvedValue('false');
    const featureName = 'testFeatureDisabled';
    const result = await isFeatureEnabled(featureName);
    expect(result).toBe(false);
    expect(mockRedisGet).toHaveBeenCalledWith(`feature:${featureName}`);
  });

  it('should return false when the feature flag is not found (null) in Redis', async () => {
    mockRedisGet.mockResolvedValue(null);
    const featureName = 'testFeatureNotFound';
    const result = await isFeatureEnabled(featureName);
    expect(result).toBe(false);
    expect(mockRedisGet).toHaveBeenCalledWith(`feature:${featureName}`);
  });

  it('should return false and log an error when Redis client.get() rejects', async () => {
    const errorMessage = 'Redis error';
    mockRedisGet.mockRejectedValue(new Error(errorMessage));
    const featureName = 'testFeatureError';
    const result = await isFeatureEnabled(featureName);
    expect(result).toBe(false);
    expect(mockRedisGet).toHaveBeenCalledWith(`feature:${featureName}`);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Error fetching feature flag '${featureName}' from Redis:`,
      expect.any(Error) // Check that an Error object was logged
    );
  });

  it('should return false if the feature flag has an unexpected string value', async () => {
    mockRedisGet.mockResolvedValue('unexpected_value');
    const featureName = 'testFeatureUnexpected';
    const result = await isFeatureEnabled(featureName);
    expect(result).toBe(false);
    expect(mockRedisGet).toHaveBeenCalledWith(`feature:${featureName}`);
  });
});
