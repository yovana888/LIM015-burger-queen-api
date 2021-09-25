const { createUserAndRole, getRolesById } = require('../services/users');
const User = require('../models/users');

module.exports = {
  getUsers: async (req, res, next) => {
    // const {page = 1, limit = 10} = req.query;
    const allUsers = await User.find({}); // devuelve todos los usuarios
    const newArrayUsers = []; // array dónde se almacenará User con sus respectivos roles
    allUsers.forEach( async e => {
      e.roles = await getRolesById(e._id);
      newArrayUsers.push(e);
    });
    res.json(allUsers);
    next();
  },
  getUserById: async (req, res) => {
    // aquí se estrae el id del url;
    const {id} = req;
    const user = await User.findById(id);
    console.log(user);
  },
  createUser: async (req, res, next) => {
    const {email, password, roles} = req.body;
    if (!email || !password) return next(400);
    const userFound = await User.findOne({email});
    if(userFound) return next(403);
    console.log(userFound);
    const user = await createUserAndRole(email, password, roles);
    const role = await getRolesById(user._id);
    user.roles = role;
    res.json(user);
    next();
  },
};
