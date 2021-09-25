const jwt = require("jsonwebtoken");
const { getUserById } = require("../services/users");

module.exports = secret => (req, resp, next) => {
  const { authorization } = req.headers;
  if (!authorization) return next();

  const [type, token] = authorization.split(" ");
  if (type.toLowerCase() !== "bearer") return next(401);

  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) return next(401);
    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const userFound = await getUserById(decodedToken.id);
    if (!userFound) return next(403);
    req.userToken = { ...{ admin: userFound.roles.admin }, ...decodedToken };
    console.log(req.userToken);
    next();
  });
};

module.exports.isAuthenticated = req =>
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
  req.userToken ? true : false;

module.exports.isAdmin = req =>
  // TODO: decidir por la informacion del request si la usuaria es admin
  req.userToken.admin ? true : false;

module.exports.requireAuth = (req, resp, next) => (!module.exports.isAuthenticated(req) ? next(401) : next());

module.exports.requireAdmin = (req, resp, next) =>
  // eslint-disable-next-line no-nested-ternary
  !module.exports.isAuthenticated(req) ? next(401) : !module.exports.isAdmin(req) ? next(403) : next();
