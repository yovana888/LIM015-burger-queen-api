const {Schema, model} = require('mongoose');

const userSchema = Schema({
  email:{
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true
  },
  password:{
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  roles:{
    admin : {
      type: Boolean,
      required: true,
    },
  },
  state: {
    type: Boolean,
    default: true
  }
})

module.exports = model('Users', userSchema);