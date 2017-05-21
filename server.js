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
mongoose.connect(process.env.MONGODB_URI || "MONGODB_URI='mongodb://localhost/decision-task");

var sessionSchema = mongoose.Schema({
  results: {
      type: Object,
      choice_problem_1: {
        samples : [
          {
            option: String,
            value: Number
          }
        ],
        final_decision: Number
      }
  }
});
// var sessionSchema = mongoose.Schema({
//   results: String
// });
var Session = mongoose.model('Session', sessionSchema);
var baseSession = {
  results: {
      choice_problem_1: {
        samples : []
      }
  }
};
var newSession = new Session(baseSession);
//Task

var taskSchema = mongoose.Schema({
    name: String,
    answers: []
});

var Task = mongoose.model('Task', taskSchema);

var task1 = new Task({
    name: 'Decision Task 2',
    answers: [ [1,2,3,4,5], [5,4,3,2,1] ]
});

//write to database user by id: subjecta
//send results of respective choice problem

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

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/choice-problem-1/', function(req, res) {
  res.render('pages/choice-problem-1');
});

app.use('/create-session/', function(req, res){

  console.log('create new session');

  newSession.save(function (err, savedSession) {
    console.log('save started');
    if (err) {
      console.log(err);
    } else {

      console.log('Session created successfully with id: ', newSession._id);
      res.json(savedSession)
    }
  });

  // res.json({id: newSession._id });
});

app.use('/send-option/:problemNumber', function(req, res){
  req.params.problemNumber;
  console.log(req.params.problemNumber);
  var obj = {"problem":req.params.problemNumber};

  var obj = {"problem":req.params.problemNumber};
  var id = '59210177326f0d96aa174fea';
  Session.findById(id, function (err, session) {
    if (err) return handleError(err);
    console.log(session.results.choice_problem_1.samples);
    var newSample = {
      option: 'a',
      value: 0.25
    }
    newSession.results.choice_problem_1.samples.push(newSample);
    newSession.save(function (err, updatedSample) {
      if (err) return handleError(err);
      res.send(updatedSample);
    });
  });

  // res.json(obj);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
