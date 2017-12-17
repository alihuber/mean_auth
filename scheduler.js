const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
require('./backend/models/user');
const User       = mongoose.model('User');

let formatDate = (date) => {
  return date.getUTCFullYear() + "/" +
    ("0" + (date.getUTCMonth() + 1)).slice(-2) + "/" +
    ("0" + date.getUTCDate()).slice(-2) + " " +
    ("0" + date.getUTCHours()).slice(-2) + ":" +
    ("0" + date.getUTCMinutes()).slice(-2) + ":" +
    ("0" + date.getUTCSeconds()).slice(-2);
};

module.exports.triggerDueEvents = () => {
  console.log('checking events...');
  return User.find({}, (err, users) => {
    users.forEach((user) => {
      let dueDate = user.nextEvent;
      if(dueDate && dueDate <= Date.now()) {
        console.log("found due date: " + dueDate.toISOString());
        console.log("Date.now " + new Date().toISOString());
        console.log("event for user " + user.username);
        user.setNextEvent();
        user.save(function(err, user) {
          if(err) {
            console.log('error saving user ' + user._id);
          }
        });
        console.log("set next event to " +
          formatDate(user.nextEvent) +
          " for user " + user.username);
      }
    });
  });
};
