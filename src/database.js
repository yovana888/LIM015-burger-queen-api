const mongoose = require('mongoose');
const config = require('./config');

// TODO: Conexión a la Base de Datos con mongoose
const { dbUrl } = config;
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.info('Base de datos conectada online'))
  .catch((err) => console.error(err));
