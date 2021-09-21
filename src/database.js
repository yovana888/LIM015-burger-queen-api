const mongoose = require('mongoose');
const config = require('./config');

// TODO: Conexión a la Base de Datos con mongoose
const { dbUrl } = config;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Base de datos conectada online'))
  .catch((err) => console.error(err));

// mongoose.connection.once('open', () => {
//   console.log('DB is connected');
// });