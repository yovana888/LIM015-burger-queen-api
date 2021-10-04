const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');

const request = supertest(app);

const databaseName = 'harryPotter';

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

const adminUser = {
  email: 'admin@localhost',
  password: 'changeme',
};
const failUser = {
  email: 'admin@fail',
  password: '12345.Abc',
};

describe('POST', () => {
  it('should return a token', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      expect(response.status).toBe(200);
      expect(typeof response.body.token).toBe('string');
      done();
    });
  });
  it('should return 400 when not email or password', (done) => {
    request.post('/auth').send({}).then((response) => {
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Email or password not found' });
      done();
    });
  });
  it('should return 404 when user not found', (done) => {
    request.post('/auth').send(failUser).then((response) => {
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "User doesn't exists" });
      done();
    });
  });
  it('should return 404 when password is incorrect', (done) => {
    request.post('/auth').send({
      email: 'admin@localhost',
      password: 'changeme1',
    }).then((response) => {
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Invalid password' });
      done();
    });
  });
});
