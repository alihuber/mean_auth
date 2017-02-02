process.on(`uncaughtException`, console.error);

const express      = require('express');
const http         = require('http');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const passport     = require('passport');
const scheduler    = require('./scheduler.js');

// use ES6 promises
mongoose.Promise = global.Promise;

// load user mongoose schema before passport
require('./backend/models/user');
require('./backend/config/passport');

// load index route which loads controllers and ties them to
// REST-URLs
const routesApi = require('./backend/routes/index');


const app = express();
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Set the frontend folder to serve static resources
app.use(express.static(path.join(__dirname, 'frontend')));

// Initialise Passport before using the route middleware
app.use(passport.initialize());

// Map declared routes from the API when path starts with /api
app.use('/api', routesApi);
// otherwise render the index.html page for the Angular SPA
// this means we don't have to map all of the SPA routes in Express
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// mongodb connection
if(process.env.NODE_ENV === 'test') {
  console.log('connecting to test database');
  mongoose.connect('mongodb://127.0.0.1:28017/mean_auth');
} else {
  mongoose.connect('mongodb://127.0.0.1:27017/mean_auth');
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if(err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

http.createServer(app).listen(app.get('port'), () => {
  console.log('Epress Server listening on port ' + app.get('port'));
});

scheduler.fetchEvents();

module.exports = app;
