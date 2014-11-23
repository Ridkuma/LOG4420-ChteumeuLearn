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
	var answers = req.body.answersList;
	var correct = req.body.correctId;
	Question.addQuestion(question, answers.split(", "), correct, domain, function(){});
	res.render('addQuestion', { title: 'Ajouter Question - Chteumeulearn'});
}

exports.addAllQuestions = function(req, res){
  Question.addAllQuestions(0);
  res.render('addQuestion', { title: 'Ajouter Question - Chteumeulearn'});
};