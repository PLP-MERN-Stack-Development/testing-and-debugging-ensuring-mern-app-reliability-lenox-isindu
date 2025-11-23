describe('Basic Test Suite', () => {
  test('should pass basic arithmetic', () => {
    expect(1 + 1).toBe(2);
  });

  test('should handle environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBeDefined();
  });

  test('should handle async operations', async () => {
    const result = await Promise.resolve('test data');
    expect(result).toBe('test data');
  });
});