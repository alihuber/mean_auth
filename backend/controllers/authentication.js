const passport   = require('passport');
const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
const User       = mongoose.model('User');

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.register = (req, res) => {

  if(!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, { 'message': 'All fields required' });
    return;
  }

  let user      = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.save((err) => {
    if(err) {
      // unique entry violation
      if(err.message.includes('E11000')) {
        let message = 'Please choose a different user name';
        sendJSONresponse(res, 401, { 'message': message });
      } else {
        // other database error
        sendJSONresponse(res, 401, { 'message': err.message });
      }
      return;
    }
    let token;
    token = user.generateJwt();
    res.status(200);
    res.json({ 'token' : token });
  });
};

module.exports.login = (req, res) => {

  if(!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, { 'message': 'All fields required' });
    return;
  }

  passport.authenticate('local', (err, user, info) => {
    let token;

    // If Passport throws/catches an error
    if(err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user) {
      token = user.generateJwt();
      res.status(200);
      res.json({ 'token' : token });
    } else {
      // user not found
      res.status(401).json(info);
    }
  })(req, res);
};
