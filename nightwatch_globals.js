process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

var mongoose = require('mongoose');
require('./backend/models/user');
var User     = mongoose.model('User');

module.exports = {
  before: function(done) {
    require('./app');
    console.log('populating test database...');
    var user1   = new User();
    user1.username = 'registered';
    user1.setPassword('registered');
    user1.save();
    var adminUser   = new User();
    adminUser.username = 'admin';
    adminUser.setPassword('admin');
    adminUser.isAdmin = true;
    adminUser.save();
    done();
  },

  after: function(done) {
    console.log('resetting test database...');
    mongoose.connect('mongodb://127.0.0.1:28017/mean_auth', function() {
        mongoose.connection.db.dropDatabase();
    });
    process.exit();
    done();
  }
};
