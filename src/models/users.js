const {Schema, model} = require('mongoose');

const userSchema = Schema({
  email:{
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
  },
  password:{
    type: String,
    unique : true,
    required: [true, 'La contraseña es obligatoria']
  },
  roles:[{
    ref : 'Role',
    type: Schema.Types.ObjectId,
  }],
  state: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
  versionKey: true,
});

module.exports = model('User', userSchema);