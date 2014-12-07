
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var routes = require('./routes');
var howto = require('./routes/howto');
var dashboard = require('./routes/dashboard');
var user = require('./routes/user');
var database = require('./lib/data');
var http = require('http');
var path = require('path');
var addQuestion = require('./routes/addQuestion');
var MemStore = express.session.MemoryStore;
var addQuestion = require('./routes/addQuestion');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.json());
app.use(express.json());     
app.use(express.urlencoded()); 
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/howto', howto.howto);
app.get('/dashboard',dashboard.dashboard);
app.get('/addQuestion',addQuestion.addQuestion);
app.post('/dashboard',dashboard.selectExam);
app.post('/getNumQuestions',dashboard.getNumQuestions);
app.get('/questionTest',dashboard.questionTest);
app.get('/questionExam',dashboard.questionExam);
app.post('/questionTest',dashboard.checkTestAnswer);
app.post('/questionExam',dashboard.checkAnswer);
app.get('/results',dashboard.results);
app.get('/addQuestion',addQuestion.addQuestion);
app.get('/addAllQuestions',addQuestion.addAllQuestions);
app.post('/addQuestion',addQuestion.sendNewQuestion);

app.get('/api/getRandomQuestion', dashboard.getRandomQuestion);
// app.get('/api/getQuestionAnswer/:questionId', dashboard.getQuestionAnswer);
app.get('/api/getQuestionExam', dashboard.getQuestionExam);

app.get('/api/postDomains/:domains', dashboard.postDomains);
app.get('/api/getAnswer/:id', dashboard.getAnswer);
app.post('/api/postExamChoices/:selection', dashboard.postExamChoices);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
