const {Schema, model } = require('mongoose');

const userSchema = Schema({
  email:{
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
    index: true, // acelera busqueda
  },
  password:{
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  roles:{
    ref : 'Role',
    type: Schema.Types.ObjectId,
    required: false,
  }
}, {
  timestamps: true,
  versionKey: false,
});

// userSchema.methods.comparePassword = (password) => {
//   return new Promise ((resolve, reject) => {
  //   bcrypt.compare(this.password, password, (err, isMatch) =>{
  //     if(err){
  //       reject(err)
  //     } else {
  //       resolve(isMatch);
  //     }
  //   });
//  });
// }

module.exports = model('User', userSchema);