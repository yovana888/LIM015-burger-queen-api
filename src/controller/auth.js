const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

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
    const userFound = await User.findOne({email: email});
    if (!userFound) next(404);
    
    // se comparan las contraseñas
    const comparePassword = await User.comparePassword(password)
    if(!comparePassword) return next(401);

     // TODO: autenticar a la usuarix
    const token = await generateJWT(User_id, email);
    resp.json({token});
    next();
}

