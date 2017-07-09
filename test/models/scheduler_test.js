process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

const app        = require('../../app');
const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
const should     = require('chai').should();
require('../../backend/models/user');
const User       = mongoose.model('User');
const scheduler  = require('../../scheduler');


describe('Scheduler', () => {
  after((done) => {
    console.log('resetting test database...');
    User.remove({}, function(err) {
      if(err) {
        console.log(err);
      }
      console.log('collection users removed');
    });
    done();
  });

  describe('trigger due events', () => {
    before((done) => {
      console.log('populating test database...');
      let user      = new User();
      user.username = 'registered';
      user.setPassword('registered');
      user.checkInterval = 'every 5 minutes';
      // 2017-01-01
      user.nextEvent= new Date(1483225200000);
      user.save();
      done();
    });

    it('should set next events', (done) => {
      scheduler.triggerDueEvents().then(() => {
        User.find({username: 'registered'}).then((users, err) => {
          users[0].nextEvent.should.be.above(1483225200000);
          done();
        });
      });
    });

  });

});
