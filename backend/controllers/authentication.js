var passport = require('passport');
var mongoose = require('mongoose');
var User     = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  if(!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, { 'message': 'All fields required' });
    return;
  }

  var user      = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.save(function(err) {
    if(err) {
      // unique entry violation
      if(err.message.includes('E11000')) {
        res.status(401).json('Please choose a different user name.');
      } else {
        res.status(401).json(err.message);
      }
      return;
    }
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({ 'token' : token });
  });
};

module.exports.login = function(req, res) {

  if(!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, { 'message': 'All fields required' });
    return;
  }

  passport.authenticate('local', function(err, user, info) {
    var token;

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
