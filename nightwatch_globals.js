process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

var mongoose     = require('mongoose');
mongoose.Promise = global.Promise;
require('./backend/models/user');
var User         = mongoose.model('User');



removeUsers = function(status) {
  console.log('resetting test database...');
  User.remove({}, function(err) {
    if(err) {
      console.log(err);
    }
    console.log('collection users removed');
    process.exit(status);
  });
};

module.exports = {
  before: function(done) {
    require('./app');
    console.log('populating test database...');
    var user1          = new User();
    user1.username     = 'registered';
    user1.setPassword('registered');
    user1.save();
    var adminUser      = new User();
    adminUser.username = 'admin';
    adminUser.setPassword('admin');
    adminUser.isAdmin  = true;
    adminUser.save();
    done();
  },

  reporter: function(results) {
    if ((typeof(results.failed) === 'undefined' || results.failed === 0) &&
    (typeof(results.error) === 'undefined' || results.error === 0)) {
      removeUsers(0);
    } else {
      removeUsers(1);
    }
  }
};
