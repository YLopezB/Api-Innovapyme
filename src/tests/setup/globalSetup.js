import 'dotenv/config';

export default async function setup() {
  const { cleanAllTestData, disconnectDatabase } = await import(
    './setupDatabase.js'
  );

  await cleanAllTestData();

  return async () => {
    await cleanAllTestData();
    await disconnectDatabase();
  };
}
