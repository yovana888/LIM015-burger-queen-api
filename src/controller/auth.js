const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { comparePassword } = require('../services/users');

const { secret } = config;

const generateJWT = (id, email) => new Promise((resolve, reject) => {
    const payload = { id, email };
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

// Autenticar
module.exports.auth = async (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(400);
    }
    //si no existe el usuario
    const userFound = await User.findOne({email});
    if (!userFound) next(401);

    // se comparan las contraseñas
    const existsPassword = await comparePassword(password, userFound.password)
    if(!existsPassword) return next(401);

     // TODO: autenticar a la usuarix
    const token = await generateJWT(userFound._id, userFound.email);
    resp.json({token});
    next();
};
