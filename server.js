var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
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
      total_amount: Number,
      choice_problem_1: {
        samples : [
          {
            option: String,
            value: Number
          }
        ],
        completed: Boolean,
        final_decision: Number
      }
  }
});
// var sessionSchema = mongoose.Schema({
//   results: String
// });
sessionSchema.plugin(timestamps);
var Session = mongoose.model('Session', sessionSchema);
var baseSession = {
  results: {
      choice_problem_1: {
        completed: false,
        samples : []
      },
      choice_problem_2: {
        completed: false,
        samples : []
      },
      choice_problem_3: {
        completed: false,
        samples : []
      },
      choice_problem_4: {
        completed: false,
        samples : []
      },
      choice_problem_5: {
        completed: false,
        samples : []
      },
      choice_problem_6: {
        completed: false,
        samples : []
      },
      choice_problem_7: {
        completed: false,
        samples : []
      },
      choice_problem_8: {
        completed: false,
        samples : []
      },
      total_amount: 9
  }
};
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
//
// task1.save(function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('save successful');
//   }
// });
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

app.get('/results/', function(req, res) {

  Session.find({}, function(err, sessions){
    // res.send(sessions);
    res.render('pages/results', { 'sessions' : sessions });
  });

});

app.get('/choice-problem-1/', function(req, res) {
  res.render('pages/choice-problem');
});
app.get('/choice-problem-2/', function(req, res) {
  res.render('pages/choice-problem');
});
app.get('/choice-problem-3/', function(req, res) {
  res.render('pages/choice-problem');
});
app.get('/choice-problem-4/', function(req, res) {
  res.render('pages/choice-problem');
});
app.get('/choice-problem-5/', function(req, res) {
  res.render('pages/choice-problem');
});
app.get('/choice-problem-6/', function(req, res) {
  res.render('pages/choice-problem');
});
app.get('/choice-problem-7/', function(req, res) {
  res.render('pages/choice-problem');
});
app.get('/choice-problem-8/', function(req, res) {
  res.render('pages/choice-problem');
});

app.get('/get-total/', function(req, res){
  console.log('get-total');
  Session.findOne({ _id: req.query.id }, function (err, doc){
    console.log(doc)
    res.json(doc.results.total_amount);
  });
});

app.use('/create-session/', function(req, res){

  console.log('create new session');

  var newSession = new Session(baseSession);

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

app.put('/send-option/', function(req, res){
  // console.log("req: ", req);
  req.params.problemNumber;

  Session.findOne({ _id: req.query.id }, function (err, doc){

    doc.results[req.query.problem].samples.push({
        option: req.query.option,
        value: req.query.value
      });

      doc.markModified('results.'+req.query.problem +'.samples');
      doc.save(function (err, updatedSample) {
        if (err) return handleError(err);
        res.send(updatedSample);
      });
  });
});

app.put('/send-final-decision/', function(req, res){
  // console.log("req: ", req);
  req.params.problemNumber;

  Session.findOne({ _id: req.query.id }, function (err, doc){

    if ( doc.results[req.query.problem].completed ) {
      console.log('already marked as completed');
      res.status(400);
      res.send('already marked as completed');
    } else {
      doc.results[req.query.problem].final_decision = req.query.value ;
      doc.results[req.query.problem].completed = true;
      console.log('current total amount',doc.results.total_amount );
      console.log('query value', req.query.value);
      doc.results.total_amount = Number(doc.results.total_amount) + Number(req.query.value);

      doc.markModified('results.'+req.query.problem);
      doc.markModified('results.total_amount');
      doc.save(function (err, updatedSample) {
        if (err) return handleError(err);
        res.send(updatedSample);
      });
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
