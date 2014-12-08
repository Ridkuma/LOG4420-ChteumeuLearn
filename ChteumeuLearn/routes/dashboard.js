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
	res.render('questionExam');
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