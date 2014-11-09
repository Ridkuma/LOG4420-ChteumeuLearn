
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
var MemStore = express.session.MemoryStore;

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
app.get('/questionTest',dashboard.questionTest);
app.post('/dashboard',dashboard.selectExam);
app.get('/questionExam',dashboard.questionExam);
app.post('/questionExam',dashboard.checkAnswer);
app.get('/results',dashboard.results);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
