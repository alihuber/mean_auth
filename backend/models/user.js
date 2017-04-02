const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const Schema   = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  id: ObjectId,
  username: {
    type: String,
    minlength: 2,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

userSchema.methods.setPassword = function(password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// TODO: MY_SECRET replace with cryptographically strong encrypt key, don't keep
// the secret in the code
userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    isAdmin: this.isAdmin,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET");
};

mongoose.model('User', userSchema);
