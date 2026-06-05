export default function setup() {
  return async () => {
    const { disconnectDatabase } = await import('./setupDatabase.js');
    await disconnectDatabase();
  };
}
