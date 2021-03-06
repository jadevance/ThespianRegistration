var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var massive = require('massive');
var config = require("./config.js");
var pdfMakePrinter = require('pdfmake/src/printer');

var app = module.exports = express();

// database
var db = massive.connectSync({connectionString: config.connectionString});
app.set('db', db);

var usersModel = require('./models/users.js');
// Google passport auth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: config.googleReturn
  },
  function(accessToken, refreshToken, profile, cb) {
    usersModel.findOrMakeUser(profile, function (error, user_info) {
      return cb(null, user_info)
    })
  })
)

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findOne({id: id}, function(error, user) {
    cb(error, user);
  })
});

app.use(session({
  secret: process.env.APPSECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto' }}));

app.use(passport.initialize());
app.use(passport.session());

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


// pdfMake createPdf function etc
function createPdfBinary(pdfDoc, callback) {

  var fontDescriptors = {
    Roboto: {
      normal: path.join(__dirname, '..', 'examples', '/fonts/Roboto-Regular.ttf'),
      bold: path.join(__dirname, '..', 'examples', '/fonts/Roboto-Medium.ttf'),
      italics: path.join(__dirname, '..', 'examples', '/fonts/Roboto-Italic.ttf'),
      bolditalics: path.join(__dirname, '..', 'examples', '/fonts/Roboto-MediumItalic.ttf')
    }
  };

  var printer = new pdfMakePrinter(fontDescriptors);

  var doc = printer.createPdfKitDocument(pdfDoc);

  var chunks = [];
  var result;

  doc.on('data', function (chunk) {
    chunks.push(chunk);
  });
  doc.on('end', function () {
    result = Buffer.concat(chunks);
    callback('data:application/pdf;base64,' + result.toString('base64'));
  });
  doc.end();
}

// Copied from dev-playground. How work?
app.post('/pdf', function (req, res) {

  createPdfBinary(req.body, function(binary) {
    res.contentType('application/pdf');
    res.send(binary);
  }, function(error) {
    res.send('ERROR:' + error);
  });

});



// routes
var index = require('./routes/index.js');
var users = require('./routes/users.js');
var conferences = require('./routes/conferences.js');
var registrations = require('./routes/registrations.js');
var students = require('./routes/students.js');
var invoices = require('./routes/invoices.js');

app.use('/', index);
app.use('/', users);
app.use('/', conferences);
app.use('/', registrations);
app.use('/', students);
app.use('/', invoices);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
