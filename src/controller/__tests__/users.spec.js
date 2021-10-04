const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');

const request = supertest(app);
const databaseName = 'gryffindor';
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

const adminUser = {
  email: 'admin@localhost',
  password: 'changeme',
};

const harryPotter = {
  email: 'harryPotter@test.test',
  password: '12345.Abc',
};

const germione = {
  email: 'germione@test.test',
  password: '12345.Abc',
};

const ron = {
  email: 'ron@test.test',
  password: '12345.Abc',
};

describe('POST/Users', () => {
  it('should return 200 when a new user created', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/users').set('Authorization', `Bearer ${token}`)
        .send(harryPotter)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBeTruthy();
          expect(response.body.password).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          done();
        });
    });
  });
  it('should return 200  when a new user created', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/users').set('Authorization', `Bearer ${token}`)
        .send(ron)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBeTruthy();
          expect(response.body.password).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          done();
        });
    });
  });
  it('should return 200 when a new user created', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/users').set('Authorization', `Bearer ${token}`)
        .send(germione)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBeTruthy();
          expect(response.body.password).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          request.delete(`/users/${response.body._id}`).set('Authorization', `Bearer ${token}`)
            .send(germione).expect('Content-Type', /json/)
            .expect(200)
            .then(() => done());
        });
    });
  });
  it('should return 403 when user already exists', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/users').set('Authorization', `Bearer ${token}`)
        .send(harryPotter)
        .expect('Content-Type', /json/)
        .expect(403)
        .then((response) => {
          expect(response.body).toEqual({ message: 'User with email: harryPotter@test.test already exists' });
          done();
        });
    });
  });
  it('should return 400 when incorrect for of email or password', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/users').set('Authorization', `Bearer ${token}`)
        .send({ email: 'a', password: '1' })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Incorrect format of email or password' });
          done();
        });
    });
  });
  it('should return 400 when incorrect for of email or password', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/users').set('Authorization', `Bearer ${token}`)
        .send({ email: 'algo@example.com', password: '1' })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Incorrect format of email or password' });
          done();
        });
    });
  });
  it('should return 400 when email or password is missing', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/users').set('Authorization', `Bearer ${token}`)
        .send({ email: 'algo@example.com' })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Email or password is missing' });
          done();
        });
    });
  });
});

describe('GET/Users', () => {
  it('should return all Users', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/users').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 403 when not is admin', (done) => {
    request.post('/auth').send(harryPotter).then((response) => {
      const { token } = response.body;
      request.get('/users').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(403)
        .then((response) => {
          expect(response.body.message).toEqual('Forbidden');
          done();
        });
    });
  });
});
describe('GET/Users:uid', () => {
  it('should return a user with email', (done) => {
    request.post('/auth').send(ron).then((response) => {
      const { token } = response.body;
      request.get(`/users/${ron.email}`).set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBeTruthy();
          expect(response.body.password).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          done();
        });
    });
  });
  it('should return 404 when user does not exits', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/users/algo@fail.com').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'User: algo@fail.com does not exists' });
          done();
        });
    });
  });
  it('should return 403 when is not admin', (done) => {
    request.post('/auth').send(ron).then((response) => {
      const { token } = response.body;
      request.get(`/users/${harryPotter.email}`).set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(403)
        .then(() => done());
    });
  });
});

describe('PUT/Users:uid', () => {
  it('should return 404 when uid does not exits', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.put('/users/algo@fail.com').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'User: algo@fail.com does not exists' });
          done();
        });
    });
  });
  it('should return 403 when uid has not admin rol or not owner', (done) => {
    request.post('/auth').send(ron).then((response) => {
      const { token } = response.body;
      request.put(`/users/${adminUser.email}`).set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(403)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Admin permission is required or be the owner' });
          done();
        });
    });
  });
  it('should return 403 when not has admin rol', (done) => {
    request.post('/auth').send(ron).then((response) => {
      const { token } = response.body;
      request.put(`/users/${ron.email}`).set('Authorization', `Bearer ${token}`)
        .send({ roles: { admin: true } })
        .expect('Content-Type', /json/)
        .expect(403)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Admin permission is required to modified roles value' });
          done();
        });
    });
  });
  it('should return 400 when email or password is missing', (done) => {
    request.post('/auth').send(ron).then((response) => {
      const { token } = response.body;
      request.put(`/users/${ron.email}`).set('Authorization', `Bearer ${token}`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Email or password is missing' });
          done();
        });
    });
  });
  it('should return 400 when incorrect format of email', (done) => {
    request.post('/auth').send(ron).then((response) => {
      const { token } = response.body;
      request.put(`/users/${ron.email}`).set('Authorization', `Bearer ${token}`)
        .send({ email: 'a' })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Incorrect format of email' });
          done();
        });
    });
  });
  it('should return 400 when incorrect format of password or email', (done) => {
    request.post('/auth').send(ron).then((response) => {
      const { token } = response.body;
      request.put(`/users/${ron.email}`).set('Authorization', `Bearer ${token}`)
        .send({ email: 'algo@algo.com', password: '1' })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Incorrect format of password' });
          done();
        });
    });
  });
  it('should return 200 when updated user is correct', (done) => {
    request.post('/auth').send(ron).then((response) => {
      const { token } = response.body;
      request.put(`/users/${ron.email}`).set('Authorization', `Bearer ${token}`)
        .send({ email: 'ron123@test.test' })
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.password).toBeTruthy();
          expect(response.body.roles).toBeTruthy();
          expect(response.body.email).toEqual('ron123@test.test');
          done();
        });
    });
  });
  it('should return 200 when updated user is correct', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.put('/users/ron123@test.test').set('Authorization', `Bearer ${token}`)
        .send({ roles: { admin: true } })
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.email).toBeTruthy();
          expect(response.body.password).toBeTruthy();
          expect(response.body.roles.admin).toBe(true);
          done();
        });
    });
  });
});

describe('DELETE/Users:uid', () => {
  it('should return 403 when has not admin rol', (done) => {
    request.post('/auth').send(harryPotter).then((response) => {
      const { token } = response.body;
      request.delete(`/users/${adminUser.email}`).set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(403)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Admin permission is required or be the owner' });
          done();
        });
    });
  });
  it('should return 403 when has not admin rol', (done) => {
    request.post('/auth').send(harryPotter).then((response) => {
      const { token } = response.body;
      request.delete('/users/algo@fail.com').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'User: algo@fail.com does not exists' });
          done();
        });
    });
  });
  it('should return 200 when user was deleted', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.delete('/users/ron123@test.test').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBeTruthy();
          expect(response.body.password).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          done();
        });
    });
  });
  it('should return 200 when user was deleted', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.delete(`/users/${harryPotter.email}`).set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBeTruthy();
          expect(response.body.password).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          done();
        });
    });
  });
});
