var Question = require('../models/question.js');
var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

/*
 * GET addQuestion page.
 */

exports.addQuestion = function(req, res){
  res.render('addQuestion', { title: 'Ajouter Question - Chteumeulearn'});
};

exports.sendNewQuestion = function(req, res) {
	var question = req.body.question;
	var domain = req.body.domain;
	//var answers = $(req.body.answers).children('input[name=answer]:not(.lastAnswer)');
	var answers = req.body.answer;
	//var correct = $(req.body.answers).children('input[name=correct]:checked').index('input[name=correct]');
	var correct = req.body.correct;
	console.log(question);
	console.log(domain);
	console.log(answers.length);
	console.log(correct);
	//Question.addQuestion(question, answers, correct, domain, function(){});
	res.render('addQuestion', { title: 'Ajouter Question - Chteumeulearn'});
}

exports.addAllQuestions = function(req, res){
  Question.addAllQuestions();
  res.render('addQuestion', { title: 'Ajouter Question - Chteumeulearn'});
};