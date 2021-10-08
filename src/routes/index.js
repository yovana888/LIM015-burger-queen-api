const auth = require('./auth');
const users = require('./users');
const products = require('./products');
const orders = require('./orders');

const root = (app, next) => {
  const pkg = app.get('pkg');
  app.get('/', (req, res) => res.json({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author.name,
    license: pkg.license,
  }));
  app.all('*', (req, res, nextAll) => nextAll(404));
  return next();
};

// eslint-disable-next-line consistent-return
const register = (app, routes, cb) => {
  if (!routes.length) {
    return cb();
  }

  routes[0](app, (err) => {
    if (err) {
      return cb(err);
    }
    return register(app, routes.slice(1), cb);
  });
};

module.exports = (app, next) => register(app, [auth, users, products, orders, root], next);
