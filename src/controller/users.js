const { createUserAndRole } = require('../services/users');

module.exports = {
  getUsers: (req, resp, next) => {
  },
  createUser: async (req, resp, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
      return next(400);
    }
    const user = await createUserAndRole(email, password);
    resp.json(user);
    next();
  },
};
