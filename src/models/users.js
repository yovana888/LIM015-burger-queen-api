const {Schema, model, SchemaType} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = Schema({
  _id: SchemaType.ObjectId,
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
  }]
}, {
  timestamps: true,
  versionKey: true,
});

userSchema.pre('save', async () => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  userSchema.password = hash;
})

userSchema.methods.comparePassword = (password) => {
  return new Promise ((resolve, reject) => {
  bcrypt.compare(this.password, password, (err, isMatch) =>{
    if(err){
      reject(err)
    } else {
      resolve(isMatch);
    }
  })
})
  
}
module.exports = model('User', userSchema);