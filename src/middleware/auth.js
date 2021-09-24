const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { getRolesById } =  require('../services/users');

module.exports = (secret) => (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }
  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }
  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      return next(401);
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const userFound = await User.findById( decodedToken.id );
    if(!userFound) return next(403);
    const roles = await getRolesById (decodedToken.id);
    req.userToken = { ...{ admin: roles.admin }, ...decodedToken};
    next();
  });
};

module.exports.isAuthenticated = (req) => (
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
  (req.userToken) 
    ? true
    : false
);

module.exports.isAdmin = (req) => (
  // TODO: decidir por la informacion del request si la usuaria es admin
  (req.userToken.admin)
    ? true
    : false
);

module.exports.requireAuth = (req, res, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, res, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
