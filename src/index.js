const app =  require('./app');
const config = require('./config');
require('./database');

const { port } = config;

const main = async () => {
  await app.listen(port);
  console.info(`App listening on port ${port}`);
}

main();