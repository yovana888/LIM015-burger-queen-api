const {
  createUserAndRole,
  getUsersWithPagination,
  getUserByIdOrEmail,
  getUserByEmail,
  updateSingle,
  deleteSingle,
} = require('../services/users');
const { isAdmin } = require('../middleware/auth');

const { isValidEmail, convertToLinks } = require('../utils/util');

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      if (!await isAdmin(req)) return next(403);
      const { page = 1, limit = 10 } = req.query;
      const { protocol, host } = req.headers;
      const totalPages = Math.ceil((await getUsersWithPagination(1, 0)).length / limit);
      const users = await getUsersWithPagination(Number(page), Number(limit));
      const link = convertToLinks(protocol, host, 'users', limit, page, totalPages);
      res.set('links', JSON.stringify(link));
      return res.json(users);
    } catch (err) {
      next(err);
    }
  },
  getUserById: async (req, res, next) => {
    try {
      const user = await getUserByIdOrEmail(req.params.uid);
      if (!user) return res.status(404).json({ message: `User: ${req.params.uid} does not exists` });
      if (req.userToken.id === user._id.toString() || (await isAdmin(req))) {
        return res.json(user);
      }
      return next(403);
    } catch (err) {
      return next(err);
    }
  },
  createUser: async (req, res, next) => {
    try {
      const { email, password, roles } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email or password is missing' });
      if (!isValidEmail(email)) return res.status(400).json({ message: 'Incorrect format of email' });
      const userFound = await getUserByEmail(email);
      if (userFound) return res.status(403).json({ message: `User with email: ${email} already exists` });
      const user = await createUserAndRole(email, password, roles);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  },
  putUser: async (req, res, next) => {
    try {
      const admin = await isAdmin(req);
      const user = await getUserByIdOrEmail(req.params.uid);
      if (!user) return res.status(404).json({ message: `User: ${req.params.uid} does not exists` });
      if (req.userToken.id !== user._id.toString() && !admin) {
        return res.status(403).json('No tiene el rol de admin o no es su usuario a actualizar');
      }
      let { email, password, roles } = req.body;
      if (roles && !admin) {
        return res.status(403).json({ message: 'Admin permission is required to modified roles value' });
      }
      if ((Object.keys(req.body).length === 0) || email === '' || password === '') {
        return res.status(400).json({ message: 'Email or password is missing' });
      }
      if (email && !isValidEmail(email)) return res.status(400).json({ message: 'Incorrect format of email or password' });
      if (!password) password = user.password;
      if (!email) email = user.email;
      if (!roles) roles = user.roles;
      const userUpdate = await updateSingle(user._id, user.roles._id, email, password, roles);
      return res.json(userUpdate);
    } catch (err) {
      return next(err);
    }
  },
  deleteUser: async (req, res) => {
    const user = await getUserByIdOrEmail(req.params.uid);
    if (!user) return res.status(404).json({ message: `User: ${req.params.uid} does not exists` });
    if (req.userToken.id !== user._id.toString() && !await isAdmin(req)) {
      return res.status(403).json('No tiene el rol de admin o no es su usuario a actualizar');
    }
    await deleteSingle(user._id, user.roles._id);
    return res.json(user);
  },
};
