const User = require('../models/users');
const Role = require('../models/roles');
const bcrypt = require('bcrypt');

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

module.exports.comparePassword = (password, userPassword) => {
  return new Promise((resolve => {
    bcrypt.compare(password, userPassword, (err, res) => {
      resolve(res);
    });
  }))
};
