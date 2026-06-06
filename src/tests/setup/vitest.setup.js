import 'dotenv/config';
import { beforeEach, afterEach } from 'vitest';
import { cleanAllTestData } from './setupDatabase.js';

beforeEach(async () => {
  await cleanAllTestData();
});

afterEach(async () => {
  await cleanAllTestData();
});
