const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const Schema     = mongoose.Schema;
const ObjectId   = Schema.ObjectId;
const later      = require('later');


/*
possible intervals:
every 5 minutes
every 10 minutes
every 30 minutes
every 1 h
every 2 hours
every 3 hours
every 6 hours
*/
const userSchema = new Schema({
    id: ObjectId,
    username: {
      type:      String,
      minlength: 2,
      unique:    true,
      required:  true
    },
    password: {
      type:      String,
      minlength: 8,
      required:  true
    },
    checkInterval: { type: String, default: "every 1 h" },
    nextEvent:     { type: Date },
    isAdmin:       { type: Boolean, default: false },
    folders:       [String],
    subscriptions: [{URL: String, folder: String}],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

userSchema.methods.setPassword = function(password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.setNextEvent = function() {
  let interval   = later.parse.text(this.checkInterval);
  this.nextEvent = later.schedule(interval).next(2)[1];
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
