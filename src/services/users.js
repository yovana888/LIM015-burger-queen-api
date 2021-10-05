const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/users');
const Role = require('../models/roles');

const { secret } = config;

module.exports.createUserAndRole = async (email, password, roles = {}) => {
  const role = await new Role(roles).save();
  const user = new User({
    email,
    password: bcrypt.hashSync(password, 10),
    roles: role._id,
  });
  user.save();
  return user.populate('roles');
};

module.exports.comparePassword = (password, userPassword) => new Promise((resolve) => {
  bcrypt.compare(password, userPassword, (err, res) => resolve(res));
});

module.exports.generateJWT = (id) => new Promise((resolve) => {
  jwt.sign({ id }, secret, { expiresIn: '24h' }, (err, token) => resolve(token));
});

module.exports.getUsersWithPagination = async (page, limit) => {
  const users = await User.find({}).sort('email').populate('roles').skip((page - 1) * limit)
    .limit(limit);
  return users;
};

module.exports.getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).populate('roles');
  return user;
};

module.exports.getUserByIdOrEmail = async (uid) => {
  if (mongoose.Types.ObjectId.isValid(uid)) {
    const user = await User.findById(uid).populate('roles');
    return user;
  }
  const user = await module.exports.getUserByEmail(uid);
  return user;
};

module.exports.updateSingle = async (_id, rolesId, email, password, roles) => {
  await Role.findByIdAndUpdate(rolesId, roles, { new: true });
  const user = await User.findByIdAndUpdate(_id, { email, password: bcrypt.hashSync(password, 10) },
    { new: true }).populate('roles');
  return user;
};

module.exports.deleteSingle = async (_id, rolesId) => {
  await Role.deleteOne({ _id: rolesId });
  await User.deleteOne({ _id });
};
