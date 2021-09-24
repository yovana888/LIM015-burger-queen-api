const config = require('../config');
const User = require('../models/users');
const Role = require('../models/roles');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { secret } = config;

module.exports.createUserAndRole = async (email, password, roles = {}) => {
  const role = await new Role(roles).save();
  const user = new User({
    email,
    password: bcrypt.hashSync(password, 10),
    roles: role._id,
  });
  return user.save();
};

module.exports.comparePassword = (password, userPassword) => new Promise(resolve => {
  bcrypt.compare(password, userPassword, (err, res) => resolve(res));
});

module.exports.generateJWT = (id, email) => new Promise(resolve => {
  jwt.sign({id, email}, secret, {expiresIn: '4h'}, (err, token) => resolve(token));
});

module.exports.getRolesById = (id) => new Promise( resolve => {
  User.findOne({_id: id}).populate('roles').exec( (err, user) => {
    console.log(`roles : ${user.roles}`);
    resolve(user.roles);
  })
});
