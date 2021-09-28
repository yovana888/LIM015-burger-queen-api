const config = require("../config");
const User = require("../models/users");
const Role = require("../models/roles");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { secret } = config;

module.exports.createUserAndRole = async (email, password, roles = {}) => {
  const role = await new Role(roles).save();
  const user = new User({
    email,
    password: bcrypt.hashSync(password, 10),
    roles: role._id,
  });
  user.save();
  return user.populate("roles");
};

module.exports.comparePassword = (password, userPassword) =>
  new Promise(resolve => {
    bcrypt.compare(password, userPassword, (err, res) => resolve(res));
  });

module.exports.generateJWT = id =>
  new Promise(resolve => {
    jwt.sign({ id }, secret, { expiresIn: "4h" }, (err, token) => resolve(token));
  });

module.exports.getUsers = async (page, limit) => {
  return await User.find({})
    .populate("roles")
    .skip((page - 1) * limit)
    .limit(limit);
};

module.exports.getUserByEmail = async email => {
  return await User.findOne({ email }).populate("roles");
};

module.exports.getUserByIdOrEmail = async uid => {
  if (mongoose.Types.ObjectId.isValid(uid)) {
    return await User.findById(uid).populate("roles");
  }
  return await module.exports.getUserByEmail(uid);
};

module.exports.updateSingle = async (_id, rolesId, email, password, roles) => {
  await Role.findByIdAndUpdate(rolesId, roles, { new: true });
  return await User.findByIdAndUpdate(_id, { email, password: bcrypt.hashSync(password, 10) }, { new: true }).populate(
    "roles"
  );
};

module.exports.deleteSingle = async (_id, rolesId) => {
  await Role.deleteOne({ _id: rolesId });
  return await User.deleteOne({ _id });
};
