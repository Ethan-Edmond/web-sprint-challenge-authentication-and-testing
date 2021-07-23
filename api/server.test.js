// Write your tests here
const request = require('supertest');
const jwt = require('jsonwebtoken');

const db = require('../data/dbConfig');
const server = require('./server');
const jokes = require('./jokes/jokes-data');

test('sanity', () => {
  expect(true).toBe(true);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
// beforeEach(async () => {
//   await db('users').truncate();
//   await db('users')
//     .insert({
//       username: 'test',
//       password: "$2a$08$5KgcHu8JBpWvdtuB3JC7aOwbMHeGfd.36ya0rd8nFqI2p42NPCiDK" // 1234 after bcryption
//     });
// });
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

    it('responds with status 201', async () => {
      const res = await request(server)
            .post('/api/auth/register')
            .send({
              username: 'test2',
              password: '1234'
            });
      expect(res.status).toBe(201);
    });

    it('responds with newly created user', async () => {
      const res = await request(server)
            .post('/api/auth/register')
            .send({
              username: 'test3',
              password: '1234'
            });
      expect(res.body).toMatchObject({
        id: 3,
        username: 'test3'
      });
    });

  });

  // theres no seeds so testing login requires a functional register endpoint
  describe('[POST] /login', () => {

    it("doesn't effect db", async () => {
      const before = await db('users');
      await request(server)
        .post('/api/auth/login')
        .send({
          username: 'test',
          password: '1234'
        });
      const after = await db('users');
      expect(after).toMatchObject(before);
    });

    it('returns token', async () => {
      const res = await request(server)
            .post('/api/auth/login')
            .send({
              username: 'test',
              password: '1234'
            });
      const decoded = jwt.decode(res.body.token);
      expect(decoded).toMatchObject({
        id: 1,
        username: 'test',
      });
    });

    it('responds with correct status', async () => {
      const res = await request(server)
            .post('/api/auth/login')
            .send({
              username: 'test',
              password: '1234'
            });
      expect(res.status).toBe(200);
    });

  });

});

describe('/api/jokes router', () => {

  describe('[GET] /', () => {

    it('responds with correct status', async () => {
      const {body: {token}} = await request(server)
            .post('/api/auth/login')
            .send({
              username: 'test',
              password: '1234'
            });

      const res = await request(server)
            .get('/api/jokes')
            .set({ Authorization: token });
      expect(res.status).toBe(200);
    });

    it('responds with dad jokes', async () => {
      const {body: {token}} = await request(server)
            .post('/api/auth/login')
            .send({
              username: 'test',
              password: '1234'
            });

      const res = await request(server)
            .get('/api/jokes')
            .set({ Authorization: token });
      expect(res.body).toMatchObject(jokes);
    });

    it('responds correctly with message without token', async () => {
      const res = await request(server)
            .get('/api/jokes');
      expect(res.body.message).toBe('token required');
    });

    it('responds correctly with message with invalid token', async () => {
      const {body: {token}} = await request(server)
            .post('/api/auth/login')
            .send({
              username: 'test',
              password: '1234'
            });

      const badToken = token.substring(0, 5) + 'a' + token.substring(6);
      const res = await request(server)
            .get('/api/jokes')
            .set({ Authorization: badToken });
      expect(res.body.message).toBe('token invalid');
    });

    it('only responds when valid token is given', async () => {
      const {body: {token}} = await request(server)
            .post('/api/auth/login')
            .send({
              username: 'test',
              password: '1234'
            });

      const res = await request(server)
            .get('/api/jokes')
            .set({ Authorization: token });
    });
  });

});
