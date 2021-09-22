const { createUserAndRole, adminValue } = require('../services/users');

module.exports = {
  getUsers: (req, resp, next) => {
  },
  createUser: async (req, res, next) => {
    const {email, password, roles} = req.body;
    if (!email || !password) {
      return next(400);
    }
    const user = await createUserAndRole(email, password, roles, next);
    const role = await adminValue(user._id);
    user.roles = role;
    res.json(user);
    next();
  },
};
