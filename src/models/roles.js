const { Schema, model } = require('mongoose');

const roleSchema = Schema(
  {
    name: {
      type: String,
    },
  }, {
    versionKey: false,
  }
);

module.exports = model('Role', roleSchema);
