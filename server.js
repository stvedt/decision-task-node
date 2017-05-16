var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var mongoose = require('mongoose');
var app = express();
// var HerokuDB = require('./keys/mlab');
// console.log(HerokuDB);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
// view engine setup - If using a templating language
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//mongoose
// mongoose.connect('mongodb://localhost/decision-task');
//remote
mongoose.connect('mongodb://heroku_qcfr409t:aqqntmnof9th01dudo6qpvli1d@ds143131.mlab.com:43131/heroku_qcfr409t');

var taskSchema = mongoose.Schema({
    name: String,
    answers: []
});

var Task = mongoose.model('Task', taskSchema);

var task1 = new Task({
    name: 'Decision Task 2',
    answers: [ [0,1,2,3,4,5], [5,4,3,2,1] ]
});

task1.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('save successful');
  }
});
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    console.log('dev');
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

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/choice-problem-1/', function(request, response) {
  response.render('pages/choice-problem-1');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
