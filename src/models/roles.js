const { Schema, model } = require('mongoose');

const roleSchema = Schema(
  {
    name: {
      type: String,
      index: true,
      required: false,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  }, {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('Role', roleSchema);
