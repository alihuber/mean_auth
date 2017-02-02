const mongoose = require('mongoose');
const User     = mongoose.model('User');

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.fetchUsers = (req, res) => {
  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
  } else {
    User.findById(req.payload._id).exec((err, user) => {
      if(err) {
        res.status(404).json(err);
        return;
      }

      if(user) {
        if(!user.isAdmin) {
          res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
        } else {
          User.find({},
              'username isAdmin createdAt updatedAt', (err, users) => {
            res.status(200).json({"users": users});
          });
        }
      }
    });
  }
};

module.exports.findUser = (req, res) => {
  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
  } else {
    User.findById(req.payload._id).exec((err, user) => {
      if(err) {
        res.status(404).json(err);
        return;
      }

      if(user) {
        if(!user.isAdmin) {
          res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
        } else {
          let userId = req.params.id;
          User.findById(userId,
              'username isAdmin createdAt updatedAt', (err, user) => {
            res.status(200).json({"user": user});
          });
        }
      }
    });
  }
};

module.exports.createUser = (req, res) => {
  if(!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, { 'message': 'All fields required' });
    return;
  }

  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
  } else {
    User.findById(req.payload._id).exec((err, user) => {
      if(err) {
        res.status(404).json(err);
        return;
      }

      if(user) {
        if(!user.isAdmin) {
          res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
        } else {
          let newUser      = new User();
          newUser.username = req.body.username;
          newUser.isAdmin  = req.body.isAdmin;
          newUser.setPassword(req.body.password);
          newUser.save((err) => {
            if(err) {
              // unique entry violation
              if(err.message.includes('E11000')) {
                let message = 'Please choose a different user name';
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

module.exports.deleteUser = (req, res) => {
  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
  } else {
    User.findById(req.payload._id).exec((err, user) => {
      if(err) {
        res.status(404).json(err);
        return;
      }

      if(user) {
        if(!user.isAdmin) {
          res.status(401).json({ "message" : "UnauthorizedError: not allowed" });
        } else {
          let userId = req.params.id;
          User.findById(userId, (err, user) => {
            user.remove((err, user) => {
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
          let userId = req.params.id;
          User.findById(userId, function(err, userToUpdate) {
            userToUpdate.username = req.body.username;
            userToUpdate.isAdmin  = req.body.isAdmin;
            userToUpdate.setPassword(req.body.password);
            userToUpdate.save(function(err, user) {
              if(err) {
                // unique entry violation
                if(err.message.includes('E11000')) {
                  let message = 'Please choose a different user name';
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
