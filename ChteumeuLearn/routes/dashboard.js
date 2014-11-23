var data = require('../lib/data');
var Question = require('../models/question.js');

/*
 * GET dashboard page.
 */

exports.dashboard = function(req,res){
	res.render('dashboard', { title: 'Tableau de Bord - Chteumeulearn',maxQuestions:10});
};

exports.questionTest = function(req,res) {
	Question.getRandomQuestionInData(function(questionTest){
	console.log(questionTest.question);
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

exports.checkTestAnswer = function(req,res) {
	var question = req.session.actualQuestion;
	res.render("questionTest", { title: 'Test Rapide - Chteumeulearn', 
								randomQuestion: question , 
								correct: question.correct, 
								checkedAnswer: req.body.answer, 
								method:"GET",
								action:'/questionTest',
								button:"Suivant"});
}

exports.selectExam = function(req,res) {
	var selected = req.body.testDomain;
	var numQuestionsSelected = req.body.numQuestionSelected;
	var selected = req.session.domainsSelected;
	/*Question.getIds(selected,numQuestionsSelected,function(questions){
		req.session.questsIds=questions;
		console.log(req.session.questsIds);
		req.session.numQuestions=req.session.questsIds.length;
		res.redirect('/questionExam');	
	});*/
	var questionsExam =[];
	var allQuestions = req.session.questsIds;
	for(var i = 0;i< numQuestionsSelected;i++){
		var randPick = Math.floor(Math.random()* allQuestions.length);
      	questionsExam[i] = allQuestions[randPick];
      	allQuestions.splice(randPick,1);      
	}
	req.session.questsIds=questionsExam;
	res.redirect('/questionExam');
}

exports.questionExam = function(req,res) {
	var numQuestionsSelected = req.body.numQuestionSelected;
	var questions = req.session.questsIds;
	var randomQuestion;
	if(req.session.questsIds != 0){
		var randPick = Math.floor(Math.random()* questions.length);
    randomQuestion = questions[randPick];
    req.session.actualQuestion = randomQuestion;
    questions.splice(randPick,1);      
		req.session.questsIds=questions;
		console.log(randomQuestion);
		res.render('questionExam', { title: 'Examen - Chteumeulearn',
									 randomQuestion : randomQuestion,
									 method:"POST", 
									 action:'/questionExam',
									 checkedAnswer:-1,
									 correct:-1,
									 button:"Corriger"});
	}
	else{
		res.redirect('/results');
	}
	
}

exports.checkAnswer = function(req,res) {
	var question = req.session.actualQuestion;
	var correct = question.correct;
	var checked = req.body.answer;
	if(req.session.questsIds.length==0){
		buttonText="Terminé";
	}
	else{buttonText="Suivant";}
	res.render("questionExam", { title: 'Examen - Chteumeulearn',
								 randomQuestion:question ,
								 correct: correct, 
								 checkedAnswer: checked, 
								 method:"GET",
								 action:'/questionExam',
								 button:buttonText});
	
}

exports.getNumQuestions = function(req,res) {
	var selected = req.body.testDomain;
	req.session.domainsSelected=selected;
	Question.getIds(selected,0,function(questions){
		req.session.questsIds=questions;
		req.session.numQuestions=req.session.questsIds.length;
		var max=req.session.numQuestions;
		res.render('dashboard',{title: 'Tableau de Bord - Chteumeulearn', maxQuestions :max});
	});
	
	
}


exports.results = function(req,res) {
	res.render('results', { title: 'Resultats - Chteumeulearn'});
}