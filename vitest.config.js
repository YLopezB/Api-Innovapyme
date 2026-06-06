import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/tests/**/*.test.js'],
    pool: 'forks',
    maxWorkers: 1,
    fileParallelism: false,
    sequence: { concurrent: false },
    setupFiles: ['src/tests/setup/vitest.setup.js'],
    globalSetup: ['src/tests/setup/globalSetup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
    },
  },
});
