const {
  createUserAndRole,
  getUsers,
  getUserByIdOrEmail,
  getUserByEmail,
  updateSingle,
  deleteSingle,
} = require("../services/users");

module.exports = {
  getUsers: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const host = req.headers.host; // localhost:80
    const totalPages = parseInt((await getUsers(1, 0)).length / limit);
    const users = await getUsers(Number(page), Number(limit));
    const link = {
      first: page === 1 ? false : `http://${host}/users?page=1`,
      next: page === totalPages ? false : `http://${host}/users?${Number(page) + 1}`,
      prev: page === 1 ? false : `http://${host}/users?page=${Number(page) - 1}`,
      last: page === totalPages ? false : `http://${host}/users?page=${totalPages}`,
    };
    res.set("Link", JSON.stringify(link));
    res.json(users);
  },
  getUserById: async (req, res) => {
    const user = await getUserByIdOrEmail(req.params.uid);
    res.json(user);
  },
  createUser: async (req, res) => {
    const { email, password, roles } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email or password not found" });
    const userFound = await getUserByEmail(email);
    if (userFound) return res.status(403).json({ message: `User with email: ${email} already exists` });
    const user = await createUserAndRole(email, password, roles);
    res.json(user);
  },
  putUser: async (req, res) => {
    const user = await getUserByIdOrEmail(req.params.uid);
    if (!user) return res.status(404).json({ message: "User does not exists" });
    const admin = req.userToken.admin;
    if (req.userToken.id !== user._id.toString() && !admin) {
      return res.status(403).json({ message: "Admin permission is required or be the same user that wants modified" });
    }
    const { email, password, roles } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email or password not found" });
    if (roles && !admin) {
      return res.status(403).json({ message: "Admin permission is required to modified roles value" });
    }
    const userUpdate = await updateSingle(user._id, user.roles._id, email, password, roles);
    res.json(userUpdate);
  },
  deleteUser: async (req, res) => {
    const user = await getUserByIdOrEmail(req.params.uid);
    if (!user) return res.status(404).json({ message: "User does not exists" });
    if (req.userToken.id !== user._id.toString() && !req.userToken.admin) {
      return res.status(403).json({ message: "Admin permission is required or be the same user that wants delete" });
    }
    const deletedCount = await deleteSingle(user._id, user.roles._id);
    res.json({ ...user, ...deletedCount });
  },
};
