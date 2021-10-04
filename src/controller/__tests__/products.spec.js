const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');

const request = supertest(app);
const databaseName = 'slytherin';
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

const productOne = {
  name: 'Cervezas de mantequilla',
  price: 10,
};
const productTwo = {
  name: 'Jugo de calabaza',
  price: 10,
  image: 'url',
  type: 'Jugos',
};

describe('POST/products', () => {
  it('should return 200  when a new product was created', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/products').set('Authorization', `Bearer ${token}`)
        .send(productOne)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBeTruthy();
          expect(response.body.price).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          done();
        });
    });
  });
  it('should return 200 when a new product was created', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/products').set('Authorization', `Bearer ${token}`)
        .send(productTwo)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBeTruthy();
          expect(response.body.price).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          expect(response.body.image).toBeTruthy();
          expect(response.body.type).toBeTruthy();
          done();
        });
    });
  });
  it('should return 400 when typeof of price is not number', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/products').set('Authorization', `Bearer ${token}`)
        .send({ name: 'algo', price: 'a' })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'typeof of price is not a number' });
          done();
        });
    });
  });
  it('should return 400 when name or price is missing', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/products').set('Authorization', `Bearer ${token}`)
        .send({ name: 'algo' })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Name or Price is missing' });
          done();
        });
    });
  });
});

describe('GET/products', () => {
  it('should return all Products', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return all Products when is not admin', (done) => {
    request.post('/auth').send(harryPotter).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 403 when is not autenticated', (done) => {
    request.get('/products').set('Authorization', 'Bearer 13656487weadvsyv')
      .expect('Content-Type', /json/)
      .expect(403)
      .then((response) => {
        expect(response.body.message).toEqual('Forbidden');
        done();
      });
  });
});

describe('GET/products:productId', () => {
  it('should return a product by Id', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.get(`/products/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body.name).toBeTruthy();
              expect(response.body.price).toBeTruthy();
              expect(response.body._id).toBeTruthy();
              done();
            });
        });
    });
  });
  it('should return a product by Id when is not admin', (done) => {
    request.post('/auth').send(harryPotter).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.get(`/products/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body.name).toBeTruthy();
              expect(response.body.price).toBeTruthy();
              expect(response.body._id).toBeTruthy();
              done();
            });
        });
    });
  });
  it('should return 404 when product doesn`t exists', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/products/algo@fail.com').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Product: algo@fail.com does not exists' });
          done();
        });
    });
  });
});

describe('PUT/products:productId', () => {
  it('should return 404 when productId does not exits', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.put('/products/algo@fail.com').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Product: algo@fail.com does not exists' });
          done();
        });
    });
  });
  it('should return 403 when is not admin', (done) => {
    request.post('/auth').send(harryPotter).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.put(`/products/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(403)
            .then((response) => {
              expect(response.body.message).toEqual('Forbidden');
              done();
            });
        });
    });
  });
  it('should return 400 when typeof of price is not number', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.put(`/products/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .send({ price: 'a' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((response) => {
              expect(response.body).toEqual({ message: 'typeof of price is not a number' });
              done();
            });
        });
    });
  });
  it('should return 200 when product is updated', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.put(`/products/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .send({ price: 5 })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body._id).toBeTruthy();
              expect(response.body.name).toBeTruthy();
              expect(response.body.price).toBe(5);
              done();
            });
        });
    });
  });
  it('should return 400 when properties not found', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.put(`/products/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
            .then((response) => {
              expect(response.body).toEqual({ message: 'Properties not found' });
              done();
            });
        });
    });
  });
});

describe('DELETE/products:productId', () => {
  it('should return 403 when is not admin', (done) => {
    request.post('/auth').send(harryPotter).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.delete(`/products/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(403)
            .then((response) => {
              expect(response.body.message).toEqual('Forbidden');
              done();
            });
        });
    });
  });
  it('should return 404 when product does not exits', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.delete('/products/algo').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Product: algo does not exists' });
          done();
        });
    });
  });
  it('should return 200 when product was deleted', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/products').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.delete(`/products/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body.name).toBeTruthy();
              expect(response.body.price).toBeTruthy();
              expect(response.body._id).toBeTruthy();
              done();
            });
        });
    });
  });
});
