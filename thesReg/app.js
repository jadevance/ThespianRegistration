var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var massive = require('massive');
var config = require("./config.js");
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var app = module.exports = express();

// database
var db = massive.connectSync({connectionString: config.connectionString});
app.set('db', db);

// routes
var index = require('./routes/index.js');
var users = require('./routes/users.js');
app.use('/', index);
app.use('/', users);

// Google passport auth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: config.googleReturn
  },
  function(accessToken, refreshToken, profile, cb) {
    db.users.findOne({google_id: profile.id}, function(error, user) {
      if (error) {
        cb(error, undefined)
      } else if (!user) {
        db.users.save({google_id: profile.id}, function(error, newUser) {
          if (error || !newUser) {
            cb(error, undefined)
          } else {
            cb(null, newUser)
          }
        })
      } else {
        cb(null, user)
      }
    })
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findOne({id: id}, function(error, user) {
    cb(error, user);
  })
});

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: process.env.APPSECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto' }}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
