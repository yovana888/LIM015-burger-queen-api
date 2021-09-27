const { createUserAndRole, getUsers, getUserById, getUserByEmail } = require("../services/users");

module.exports = {
  getUsers: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const host = req.headers.host; // localhost:80
    const totalPages = parseInt((await getUsers(1, 0)).length / limit);
    const users = await getUsers(Number(page), Number(limit));
    const link = {
      first: page === 1 ? false : `http://${host}/users?page=1`,
      next: page === totalPages ? false : `http://${host}/users?${Number(page) + 1}`,
      prev: page === 1 ? "none" : `http://${host}/users?page=${Number(page) - 1}`,
      last: page === totalPages ? false : `http://${host}/users?page=${totalPages}`,
    };
    res.set("Link", JSON.stringify(link));
    res.json(users);
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
