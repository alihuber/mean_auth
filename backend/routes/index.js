var express = require('express');
var router  = express.Router();
var jwt     = require('express-jwt');
// replace with cryptographically strong encrypt key, don't keep
// the secret in the code
// JWT payload will be bound to this value (req.{value})
// in ProfileController: User.findById(req.payload._id)
var auth    = jwt({ secret: 'MY_SECRET', userProperty: 'payload' });

var profileController = require('../controllers/profile');
var authController    = require('../controllers/authentication');

// Express router methods signature:
// router.METHOD(path, callback1, callbackN)

// profile
router.get('/profile', auth, profileController.profileRead);

// authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
