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
      console.log('before: ', before);
    });
    it.todo('responds with correct status');
    it.todo('responds with newly created user');
  });

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
