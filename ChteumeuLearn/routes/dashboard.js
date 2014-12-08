var data = require('../lib/data');
var Question = require('../models/question.js');

/*
 * GET dashboard page.
 */

exports.dashboard = function(req,res){
	res.render('dashboard', { title: 'Tableau de Bord - Chteumeulearn'});
};

exports.questionTest = function(req,res) {
	Question.getRandomQuestionInData(function(questionTest){
	req.session.actualQuestion = questionTest;
	res.render('questionTest', { title: 'Test Rapide - Chteumeulearn', 
								randomQuestion : questionTest,
								method:"POST",
								action:'/questionTest',
								checkedAnswer:-1,
								correct:-1,
								button:"Corriger" });
	});
	
}

exports.questionExam = function(req,res) {
	res.render('questionExam');
}

exports.results = function(req,res) {
	res.render('results', { title: 'Resultats - Chteumeulearn'});
}

exports.postDomains = function (req,res) {
	req.session.domains = JSON.parse(req.params.domains);
	var selected = req.session.domains;
	Question.getIds(selected,0,function(questions){
		req.session.questsIds=questions;
		req.session.numQuestions=req.session.questsIds.length;
		var max=req.session.numQuestions;
		res.json(max);
	});
}

exports.getRandomQuestion = function (req, res) {
	Question.getRandomQuestionInData(function(questionTest){
		var response = 
		{
  		id: questionTest._id,
  		domain: questionTest.domain,
  		question: questionTest.question,
  		answers: questionTest.answers,
		};
		res.json(response);
	});
}

exports.getAnswer = function (req, res) {
	var id = req.params.id;
	Question.getAnswer(id,function(answer){
		res.json(answer);
	});
}

exports.postExamChoices = function (req, res) {
	var selection = JSON.parse(req.params.selection);

    Question.getIds(selection.domains,0,function(questions){
        req.session.questsIds = questions;
    });
	var questionsExam =[];
	for(var i = 0;i< parseInt(selection.count);i++){
		var randPick = Math.floor(Math.random()* req.session.questsIds.length);
      	questionsExam[i] = req.session.questsIds[randPick];
      	req.session.questsIds.splice(randPick,1);      
	}
	req.session.questsIds = questionsExam;
    req.session.remainingExamQuestion = parseInt(selection.count);
    req.session.examDomains = selection.domains;
    res.json();
}

exports.getQuestionExam = function(req,res) {
    if(req.session.remainingExamQuestion != 0){
        var randPick = Math.floor(Math.random()* req.session.questsIds.length);
        var randomQuestion = req.session.questsIds[randPick];
        var data = {
            id: randomQuestion._id,
            question: randomQuestion.question, 
            answers: randomQuestion.answers, 
            remaining: req.session.remainingExamQuestion
        };
        req.session.questsIds.splice(randPick,1);
        req.session.remainingExamQuestion -= 1;
        res.json(data);
    }
}


exports.getAnsweredQuestionTest = function(req,res){
	if(typeof(req.session.answeredQuestionTest) === 'undefined'){
		req.session.answeredQuestionTest=0;
	}
	res.json(req.session.answeredQuestionTest);
};

exports.getCorrectAnswersTest = function(req,res){
	if(typeof(req.session.correctAnswersTest) === 'undefined'){
		req.session.correctAnswersTest=0;
	}
	
	res.json(req.session.correctAnswersTest);
};

exports.saveStats = function(req,res){
	var stats = [];
	stats = JSON.parse(req.params.stats);
	req.session.correctAnswersTest=parseInt(stats[0]);
	req.session.answeredQuestionTest=parseInt(stats[1]);
	res.json({redirect: '/dashboard'});
};

exports.postExamResults = function(req,res) {
    if (typeof(req.session.examCount) === 'undefined') {
        req.session.examCount = 0;
        req.session.examResults = [];
    }
    var results = JSON.parse(req.params.results);
    var data = {
        score: results.score,
        maxScore: results.maxScore + req.session.remainingExamQuestion,
        domains: req.session.examDomains
    };
    req.session.examResults[req.session.examCount] = data;
    req.session.examCount++;
    res.json({redirect:'/results'});
}

exports.getLastExamResults = function(req,res) {
    res.json(req.session.examResults[req.session.examCount-1]);
}

exports.getAllExamsInfo = function(req,res) {
    var data = req.session.examResults;
    res.json(data);
}