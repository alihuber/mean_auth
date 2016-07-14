process.env.NODE_ENV = 'test';
process.env.PORT     = '3001';

var app              = require('../../app');
console.log('application is ready to be tested with external selenium tests...');
