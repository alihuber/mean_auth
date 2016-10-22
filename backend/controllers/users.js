var mongoose = require('mongoose');
var User     = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.fetchUsers = function(req, res) {
  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
  } else {
    User.findById(req.payload._id).exec(function(err, user) {
      if(err) {
        res.status(404).json(err);
        return;
      }

      if(user) {
        if(!user.isAdmin) {
          res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
        } else {
          User.find({},
              'username isAdmin createdAt updatedAt', function(err, users) {
            res.status(200).json({"users": users});
          });
        }
      }
    });
  }
};

module.exports.findUser = function(req, res) {
  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
  } else {
    User.findById(req.payload._id).exec(function(err, user) {
      if(err) {
        res.status(404).json(err);
        return;
      }

      if(user) {
        if(!user.isAdmin) {
          res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
        } else {
          var userId = req.params.id;
          User.findById(userId,
              'username isAdmin createdAt updatedAt', function(err, user) {
            res.status(200).json({"user": user});
          });
        }
      }
    });
  }
};

module.exports.createUser = function(req, res) {
  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
  } else {
    User.findById(req.payload._id).exec(function(err, user) {
      if(err) {
        res.status(404).json(err);
        return;
      }

      if(user) {
        if(!user.isAdmin) {
          res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
        } else {
          var newUser      = new User();
          newUser.username = req.body.username;
          newUser.isAdmin  = req.body.isAdmin;
          newUser.setPassword(req.body.password);
          newUser.save(function(err) {
            if(err) {
              // unique entry violation
              if(err.message.includes('E11000')) {
                var message = 'Please choose a different user name';
                sendJSONresponse(res, 500, { 'message': message });
              } else {
                // other database error
                sendJSONresponse(res, 500, { 'message': err.message });
              }
              return;
            }
            sendJSONresponse(res, 201, { 'message': 'success' });
          });
        }
      }
    });
  }
};

module.exports.deleteUser = function(req, res) {
  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
  } else {
    User.findById(req.payload._id).exec(function(err, user) {
      if(err) {
        res.status(404).json(err);
        return;
      }

      if(user) {
        if(!user.isAdmin) {
          res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
        } else {
          var userId = req.params.id;
          User.findById(userId, function(err, user) {
            user.remove(function(err, user) {
              if(err) {
                res.status(500).json(err);
              }
              res.status(200).json({ "message" : "success" });
            });
          });
        }
      }
    });
  }
};

module.exports.updateUser = function(req, res) {
  if(req.body.username === '' || req.body.password === '') {
    sendJSONresponse(res, 400, { 'message': 'All fields required' });
    return;
  }
  if(!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, { 'message': 'All fields required' });
    return;
  }

  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
  } else {
    User.findById(req.payload._id).exec(function(err, user) {
      if(err) {
        res.status(404).json(err);
        return;
      }

      if(user) {
        if(!user.isAdmin) {
          res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
        } else {
          var userId = req.params.id;
          User.findById(userId, function(err, updatedUser) {
            updatedUser.username = req.body.username;
            updatedUser.isAdmin  = req.body.isAdmin;
            updatedUser.setPassword(req.body.password);
            updatedUser.save(function(err, user) {
              if(err) {
                // unique entry violation
                if(err.message.includes('E11000')) {
                  var message = 'Please choose a different user name';
                  sendJSONresponse(res, 500, { 'message': message });
                } else {
                  // other database error
                  sendJSONresponse(res, 500, { 'message': err.message });
                }
                return;
              }
              res.status(200).json({ "message" : "success" });
            });
          });
        }
      }
    });
  }
};
