const jwt = require('jsonwebtoken');
const config = require('../config');

const { secret } = config;

const generateJWT = (email) => new Promise((resolve, reject) => {
  const payload = { email };
  jwt.sign(payload, secret, {
    expiresIn: '4h',
  }, (err, token) => {
    if (err) {
      reject(err);
    } else {
      resolve(token);
    }
  });
});

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/auth', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    // TODO: autenticar a la usuarix
    const token = await generateJWT(email);
    resp.json({ token, email });
    next();
  });

  return nextMain();
};
