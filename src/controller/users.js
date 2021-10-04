const {
  createUserAndRole,
  getUsersWithPagination,
  getUserByIdOrEmail,
  getUserByEmail,
  updateSingle,
  deleteSingle,
} = require('../services/users');
const { isAdmin } = require('../middleware/auth');

const { isValidEmail, convertToLinks, isValidPassword } = require('../utils/util');

module.exports = {
  getUsers: async (req, res) => {
    // if (!await isAdmin(req)) return next(403);
    const { page = 1, limit = 10 } = req.query;
    const { protocol, host } = req.headers;
    const totalPages = Math.ceil((await getUsersWithPagination(1, 0)).length / limit);
    const users = await getUsersWithPagination(Number(page), Number(limit));
    const link = convertToLinks(protocol, host, 'users', limit, page, totalPages);
    res.set('links', JSON.stringify(link));
    return res.json(users);
  },
  getUserById: async (req, res, next) => {
    const user = await getUserByIdOrEmail(req.params.uid);
    if (!user) return res.status(404).json({ message: `User: ${req.params.uid} does not exists` });
    if (req.userToken.id === user._id.toString() || await isAdmin(req)) {
      return res.json(user);
    }
    return next(403);
  },
  createUser: async (req, res) => {
    const { email, password, roles } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email or password is missing' });
    if (!isValidEmail(email) || !isValidPassword(password)) return res.status(400).json({ message: 'Incorrect format of email or password' });
    const userFound = await getUserByEmail(email);
    if (userFound) return res.status(403).json({ message: `User with email: ${email} already exists` });
    const user = await createUserAndRole(email, password, roles);
    return res.json(user);
  },
  putUser: async (req, res) => {
    const admin = await isAdmin(req);
    const user = await getUserByIdOrEmail(req.params.uid);
    if (!user) return res.status(404).json({ message: `User: ${req.params.uid} does not exists` });
    if (req.userToken.id !== user._id.toString() && !admin) {
      return res.status(403).json({ message: 'Admin permission is required or be the owner' });
    }
    let { email, password, roles } = req.body;
    if (roles && !admin) {
      return res.status(403).json({ message: 'Admin permission is required to modified roles value' });
    }
    if ((Object.keys(req.body).length === 0) || email === '' || password === '') {
      return res.status(400).json({ message: 'Email or password is missing' });
    }
    if (email && !isValidEmail(email)) return res.status(400).json({ message: 'Incorrect format of email' });
    if (password && !isValidPassword(password)) return res.status(400).json({ message: 'Incorrect format of password' });
    if (!password) (password = user.password);
    if (!email) (email = user.email);
    if (!roles) (roles = user.roles);
    const userUpdate = await updateSingle(user._id, user.roles._id, email, password, roles);
    return res.json(userUpdate);
  },
  deleteUser: async (req, res) => {
    const user = await getUserByIdOrEmail(req.params.uid);
    if (!user) return res.status(404).json({ message: `User: ${req.params.uid} does not exists` });
    if (req.userToken.id !== user._id.toString() && !await isAdmin(req)) {
      return res.status(403).json({ message: 'Admin permission is required or be the owner' });
    }
    await deleteSingle(user._id, user.roles._id);
    return res.json(user);
  },
};
