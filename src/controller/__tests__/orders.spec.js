const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');

const request = supertest(app);
const databaseName = 'ravenclaw';
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

const orderOne = {
  client: 'Harry Potter',
  userId: '615b841f8b07cb494f9a647a',
  products: [
    { productId: '615b852790f66e4dd49689d5' },
    { qty: 3, productId: '615b852790f66e4dd49689dd' },
  ],
};

const orderTwo = {
  client: 'Germione Granger',
  userId: '615b841f8b07cb494f9a647a',
  products: [
    { productId: '615b852790f66e4dd49689dd' },
    { qty: 2, productId: '615b852790f66e4dd49689d5' },
  ],
};

describe('POST/orders', () => {
  it('Post order', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/orders').set('Authorization', `Bearer ${token}`)
        .send(orderOne)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.client).toBeTruthy();
          expect(response.body.products).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          done();
        });
    });
  });
  it('Post order', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/orders').set('Authorization', `Bearer ${token}`)
        .send(orderTwo)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.client).toBeTruthy();
          expect(response.body.products).toBeTruthy();
          expect(response.body._id).toBeTruthy();
          done();
        });
    });
  });
  it('Should return 404 when one product does not exits', (done) => {
    const orderFail = {
      client: 'Harry Potter',
      userId: '615b841f8b07cb494f9a647a',
      products: [
        { productId: 'fail' },
      ],
    };
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/orders').set('Authorization', `Bearer ${token}`)
        .send(orderFail)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Product con id: fail does not exists' });
          done();
        });
    });
  });
  it('Should return 404 when one product does not exits', (done) => {
    const orderFail = {
      client: 'Harry Potter',
      userId: '615b841f8b07cb494f9a647a',
      products: [
        { qty: 3, productId: '615b852790f66e4dd49689dd' },
        { productId: 'fail' },
      ],
    };
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/orders').set('Authorization', `Bearer ${token}`)
        .send(orderFail)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Product con id: fail does not exists' });
          done();
        });
    });
  });
  it('Should return 404 when one product does not exits', (done) => {
    const orderFail = {
      client: 'Harry Potter',
      userId: '615b841f8b07cb494f9a647a',
      products: [
        { productId: '615b852790f66e4dd49689d5' },
        { qty: 3, productId: '615b852790f66e4dd49689dd' },
      ],
      status: 'fail',
    };
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/orders').set('Authorization', `Bearer ${token}`)
        .send(orderFail)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Invalid status value' });
          done();
        });
    });
  });
  it('Should return 404 when one product does not exits', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.post('/orders').set('Authorization', `Bearer ${token}`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ message: 'userId or Products not found' });
          done();
        });
    });
  });
});

describe('GET/orders', () => {
  it('should return all Orders', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/orders').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return all Orders when is not admin', (done) => {
    request.post('/auth').send(harryPotter).then((response) => {
      const { token } = response.body;
      request.get('/orders').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBeTruthy();
          done();
        });
    });
  });
  it('should return an error 403 when is not autenticated', (done) => {
    request.get('/orders').set('Authorization', 'Bearer 13656487weadvsyv')
      .expect('Content-Type', /json/)
      .expect(403)
      .then((response) => {
        expect(response.body.message).toEqual('Forbidden');
        done();
      });
  });
});

describe('GET/orders:orderId', () => {
  it('should return a order by Id', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/orders').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.get(`/orders/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body.client).toBeTruthy();
              expect(response.body.products).toBeTruthy();
              expect(response.body.status).toBeTruthy();
              expect(response.body._id).toBeTruthy();
              done();
            });
        });
    });
  });
  it('should return a order by Id', (done) => {
    request.post('/auth').send(harryPotter).then((response) => {
      const { token } = response.body;
      request.get('/orders').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.get(`/orders/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body.client).toBeTruthy();
              expect(response.body.products).toBeTruthy();
              expect(response.body.status).toBeTruthy();
              expect(response.body._id).toBeTruthy();
              done();
            });
        });
    });
  });
  it('should return 404 when order doesn`t exists', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/orders/fail').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Order: fail does not exists' });
          done();
        });
    });
  });
});

describe('PUT/orders:orderId', () => {
  it('should return 404 when orderId does not exits', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.put('/orders/fail').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Order con id: fail does not exists' });
          done();
        });
    });
  });
  it('should return 400 when invalid status', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/orders').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.put(`/orders/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .send({ status: 'fail' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((response) => {
              expect(response.body).toEqual({ message: 'Invalid status value' });
              done();
            });
        });
    });
  });
  it('should return 404 when product does not exits', (done) => {
    const orderFail = {
      products: [
        { productId: 'fail' },
      ],
    };
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/orders').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.put(`/orders/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .send(orderFail)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((response) => {
              expect(response.body).toEqual({ message: 'Product con id: fail does not exists' });
              done();
            });
        });
    });
  });
  it('should return 200 when product is updated', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/orders').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.put(`/orders/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .send({ status: 'delivering' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body._id).toBeTruthy();
              expect(response.body.client).toBeTruthy();
              expect(response.body.products).toBeTruthy();
              expect(response.body.status).toBe('delivering');
              done();
            });
        });
    });
  });
  it('should return 400 when properties not found', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/orders').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.put(`/orders/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
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

describe('DELETE/orders:orderId', () => {
  it('should return 404 when order does not exits', (done) => {
    request.post('/auth').send(harryPotter).then((response) => {
      const { token } = response.body;
      request.delete('/orders/fail').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Order: fail does not exists' });
          done();
        });
    });
  });
  it('should return 200 when order was deleted', (done) => {
    request.post('/auth').send(adminUser).then((response) => {
      const { token } = response.body;
      request.get('/orders').set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          request.delete(`/orders/${(response.body[0])._id}`).set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body.client).toBeTruthy();
              expect(response.body.products).toBeTruthy();
              expect(response.body.status).toBeTruthy();
              expect(response.body.userId).toBeTruthy();
              done();
            });
        });
    });
  });
});
