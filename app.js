var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Custom routes
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var profile = require('./routes/profile');
var createGoal = require('./routes/createGoal');
var signout = require('./routes/signout');
var goal = require('./routes/goal');

var app = express();

// Specify server port.
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define routes.
app.use('/', routes);
app.use('/users', users);

app.get('/login', login.form);
app.get('/register', register.form);
app.get('/profile', profile.show);
app.get('/createGoal', createGoal.chooseType);
app.get('/createGoal/:type', createGoal.detailsForm);
app.get('/signout', signout.signout);

app.get('/goal/:goalId/toggleTimer', goal.toggleTimer);
app.get('/goal/:goalId/edit', goal.edit);
app.get('/goal/:goalId/delete', goal.delete);
//app.get('/goal/:goalId/addTime');
//app.get('/goal/:goalId/edit');

app.post('/login', login.userLogin);
app.post('/register', register.userRegister);
app.post('/createGoal/:type', createGoal.saveDetails); // DONE

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
