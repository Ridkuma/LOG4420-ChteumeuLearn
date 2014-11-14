var Question = require('../models/question.js');
/*
 * GET addQuestion page.
 */

exports.addQuestion = function(req, res){
  res.render('addQuestion', { title: 'Ajouter Question - Chteumeulearn'});
};

exports.addAllQuestions = function(req, res){
  Question.addAllQuestions();
  res.render('addQuestion', { title: 'Ajouter Question - Chteumeulearn'});
};