import { getConnection } from 'typeorm';

global.beforeAll(() => {
  // Do something
});

global.beforeEach(() => {
  // Do something
});

global.afterEach(() => {
  // Do something
});

global.afterAll(async () => {
  const conn = getConnection();
  await conn.close();
});
