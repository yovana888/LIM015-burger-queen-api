const { createUserAndRole, getUsers, getUserById, getUserByEmail } = require("../services/users");

module.exports = {
  getUsers: async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const allUsers = await getUsers(Number(page), Number(limit)); // devuelve todos los usuarios
    res.json(allUsers);
    next();
  },
  getUserById: async (req, res, next) => {
    const user = await getUserById(req.params.uid);
    res.json(user);
    next();
  },
  createUser: async (req, res, next) => {
    const { email, password, roles } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email or password not found" });
    const userFound = await getUserByEmail(email);

    if (userFound) return res.status(403).json({ message: "User already exists" });
    const user = await createUserAndRole(email, password, roles);

    res.json(user);
    next();
  },
};
