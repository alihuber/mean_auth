var mongoose = require('mongoose');
var User     = mongoose.model('User');

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
          User.find({}, 'username isAdmin', function(err, users) {
            res.status(200).json({"users": users});
          });
        }
      }
    });
  }
};
