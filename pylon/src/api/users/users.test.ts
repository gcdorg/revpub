import request from 'supertest';

import app from '../../app';
import { Users } from './users.handlers';

beforeAll(async () => {
  try {
    await Users.drop();
  } catch (error) {}
});

describe('GET /api/v1/users', () => {
  it('responds with an array of users', async () =>
    request(app)
      .get('/api/v1/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
      }),
  );
});

let id = '';
describe('POST /api/v1/users', () => {
  it('responds with an error if the user is invalid', async () =>
    request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: ''
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
      }),
  );
  it('responds with an inserted object', async () =>
    request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send({
        username: 'ksaw',
        password: 'password',
        email: 'ksaw@email.com',
        firstName: 'Kyle',
        lastName: 'Saw'
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        id = response.body._id;
        expect(response.body).toHaveProperty('username');
        expect(response.body.username).toBe('ksaw');
        expect(response.body).toHaveProperty('password');
        expect(response.body.password).toBe('password');
        expect(response.body).toHaveProperty('email');
        expect(response.body.email).toBe('ksaw@email.com');
        expect(response.body).toHaveProperty('firstName');
        expect(response.body.firstName).toBe('Kyle');
        expect(response.body).toHaveProperty('lastName');
        expect(response.body.lastName).toBe('Saw');
      }),
  );
});

describe('GET /api/v1/users/:id', () => {
  it('responds with a single user', async () =>
    request(app)
      .get(`/api/v1/users/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('username');
        expect(response.body.username).toBe('ksaw');
        expect(response.body).toHaveProperty('password');
        expect(response.body.password).toBe('password');
        expect(response.body).toHaveProperty('email');
        expect(response.body.email).toBe('ksaw@email.com');
        expect(response.body).toHaveProperty('firstName');
        expect(response.body.firstName).toBe('Kyle');
        expect(response.body).toHaveProperty('lastName');
        expect(response.body.lastName).toBe('Saw');
      }),
  );
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .get('/api/v1/users/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .get('/api/v1/users/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('PUT /api/v1/users/:id', () => {
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .put('/api/v1/users/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .put('/api/v1/users/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .send({
        username: 'ksaw',
        password: 'password',
        email: 'ksaw@email.com',
        firstName: 'Kyle',
        lastName: 'Sawyer'
      })
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('responds with a single user', async () =>
    request(app)
      .put(`/api/v1/users/${id}`)
      .set('Accept', 'application/json')
      .send({
        username: 'ksaw',
        password: 'password',
        email: 'ksaw@email.com',
        firstName: 'Kyle',
        lastName: 'Sawyer'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('username');
        expect(response.body.username).toBe('ksaw');
        expect(response.body).toHaveProperty('password');
        expect(response.body.password).toBe('password');
        expect(response.body).toHaveProperty('email');
        expect(response.body.email).toBe('ksaw@email.com');
        expect(response.body).toHaveProperty('firstName');
        expect(response.body.firstName).toBe('Kyle');
        expect(response.body).toHaveProperty('lastName');
        expect(response.body.lastName).toBe('Sawyer');
      }),
  );
});

describe('DELETE /api/v1/users/:id', () => {
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .delete('/api/v1/users/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .delete('/api/v1/users/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('responds with a 204 status code', (done) => {
    request(app)
      .delete(`/api/v1/users/${id}`)
      .expect(204, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .get(`/api/v1/users/${id}`)
      .set('Accept', 'application/json')
      .expect(404, done);
  });
});