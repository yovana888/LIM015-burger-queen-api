const {Schema, model} = require('mongoose');

const productSchema = Schema({
  name:{
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
  },
  price:{
    type: Number,
    required: [true, 'La contraseña es obligatoria']
  },
  image:{
    type: URL,
    required:true,
  },
  type:{
    type: String,
    required:true,
  },
  dateEntry:{
    type: Date,
  },
}, { 
  timestamps: true,
  versionKey: true,
});

module.exports = model('Product', productSchema);