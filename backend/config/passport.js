const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose      = require('mongoose');
const User          = mongoose.model('User');

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      // other database error
      if(err) { return done(err); }
      // Return if user not found in database
      if(!user) {
        return done(null, false,
            { message: 'Invalid user/password combination.' });
      }
      // Return if password is wrong
      if(!user.validPassword(password)) {
        return done(null, false,
            { message: 'Invalid user/password combination.' });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));
