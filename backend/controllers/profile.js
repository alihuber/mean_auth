 const mongoose = require('mongoose');
 const User     = mongoose.model('User');
 
const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.fetchProfile = (req, res) => {
  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: private profile" });
  } else {
    User.findById(req.payload._id).exec((err, user) => {
      if(err) {
        res.status(404).json(err);
        return;
      }
      res.status(200).json({"username": user.username,
                            "_id": req.payload._id });
    });
  }
};

module.exports.updateProfile = (req, res) => {
  let userId = req.payload._id;
  if(!req.payload._id) {
    res.status(401).json({ "message" : "UnauthorizedError: private profile" });
  } else {
    User.findById(userId, function(err, userToUpdate) {
      userToUpdate.username = req.body.username;
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
};
