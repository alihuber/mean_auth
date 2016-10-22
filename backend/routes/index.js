var express = require('express');
var router  = express.Router();
var jwt     = require('express-jwt');

// TODO: MY_SECRET replace with cryptographically strong encrypt key, don't keep
// the secret in the code
var auth    = jwt({ secret: 'MY_SECRET', requestProperty: 'payload' });

var profileController = require('../controllers/profile');
var authController    = require('../controllers/authentication');
var usersController   = require('../controllers/users');

// jwt middleware will attach a property set by "requestProperty: 'foo'" (like
// above) to the request object (default: "req.user"). So every request object
// in subsequent callback functions will have the 'payload' property attached
// which contains the decoded jwt token contents: _id, username, expires
router.get('/profile', auth, profileController.profileRead);

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/users', auth, usersController.fetchUsers);
router.get('/user/:id', auth, usersController.findUser);
router.delete('/user/:id', auth, usersController.deleteUser);
router.put('/user/:id', auth, usersController.updateUser);
router.post('/user', auth, usersController.createUser);

module.exports = router;
