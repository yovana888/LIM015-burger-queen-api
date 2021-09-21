const User = require('../models/users');
const Role = require('../models/roles');
const bcrypt = require('bcrypt');

module.exports.createUserAndRole = async (email, password, roles = {} ) => {
  const role = await new Role(roles).save();
  const user = new User({
    email,
    password: bcrypt.hashSync(password, 10),
    roles: role._id,
  });
  return await user.save();
};
