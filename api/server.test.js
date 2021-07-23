// Write your tests here
const db = require('../data/dbConfig');
const server = require('./server');
const request = require('supertest');

test('sanity', () => {
  expect(true).toBe(false);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
afterAll(async () => {
  await db.destroy();
});

describe('/api/auth router', () => {

  describe('[POST] /register', () => {
    it('adds new user to db', async () => {
      const before = await db('users');
      expect(before).toMatchObject([]);
      await request(server)
        .post('/api/auth/register')
        .send({
          username: 'test',
          password: '1234'
        });
      const after = await db('users');
      expect(after).toMatchObject([
        {
          username: 'test'
        }
      ]);
    });
    it.todo('responds with correct status');
    it.todo('responds with newly created user');
  });

  // theres no seeds so testing login requires a functional register endpoint
  describe('[POST] /login', () => {
    it.todo('returns token');
    it.todo('responds with correct status');
  });

});

describe('/api/jokes router', () => {

  describe('[GET] /', () => {
    it.todo('responds with correct status');
    it.todo('responds with dad jokes');
    it.todo('only responds when valid token is given');
  });

});
