const config = require('../config');
const User = require('../models/users');
const Role = require('../models/roles');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { secret } = config;

module.exports.createUserAndRole = async (email, password, roles = {} ) => {
  const userFound = await User.findOne({email});
  if (!userFound) { //sólo si no existe el usuario
    const role = await new Role(roles).save();
    const user = new User({
      email,
      password: bcrypt.hashSync(password, 10),
      roles: role._id,
    });
    return user.save();
  }   
};

module.exports.comparePassword = (password, userPassword) => new Promise(resolve => {
  bcrypt.compare(password, userPassword, (err, res) => resolve(res));
});

module.exports.generateJWT = (id, email) => new Promise(resolve => {
  jwt.sign({id, email}, secret, {expiresIn: '4h'}, (err, token) => resolve(token));
});
