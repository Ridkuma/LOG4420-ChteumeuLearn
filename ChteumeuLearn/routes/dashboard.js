var data = require('../lib/data');

/*
 * GET dashboard page.
 */

exports.dashboard = function(req,res){
	res.render('dashboard', { title: 'Tableau de Bord - Chteumeulearn',maxQuestions:10});
};

exports.questionTest = function(req,res) {
	var questionTest = data.getRandomQuestionInData();
	req.session.actualQuestion = questionTest;
	res.render('questionTest', { title: 'Test Rapide - Chteumeulearn', 
								randomQuestionTest : questionTest,
								method:"POST",
								checkedAnswer:-1,
								correct:-1,
								button:"Corriger" });
}

exports.checkTestAnswer = function(req,res) {
	var question = req.session.actualQuestion;
	res.render("questionTest", { title: 'Test Rapide - Chteumeulearn', 
								randomQuestionTest: question , 
								correct: question.correct, 
								checkedAnswer: req.body.answer, 
								method:"GET",
								button:"Suivant"});
}

exports.selectExam = function(req,res) {
	var selected = req.body.testDomain;
	var numQuestionsSelected = req.body.numQuestionSelected;
	var selected = req.session.domainsSelected;
	req.session.questsIds=data.getIds(selected,numQuestionsSelected);
	req.session.numQuestions=req.session.questsIds.length;
	res.redirect('/questionExam');
}

exports.questionExam = function(req,res) {
	if(req.session.questsIds != 0){
		var newIds = req.session.questsIds;
		var randomQuestion = data.getRandomQuestionById(newIds);
		req.session.actualQuestion = randomQuestion;
		var index = req.session.questsIds.indexOf(randomQuestion.id);
		newIds.splice(index,1);
		res.render('questionExam', { title: 'Examen - Chteumeulearn', randomQuestionExam : randomQuestion,method:"POST", checkedAnswer:-1, correct:-1,button:"Corriger"});
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
	res.render("questionExam", { title: 'Examen - Chteumeulearn',randomQuestionExam:question , correct: correct, checkedAnswer: checked, method:"GET",button:buttonText});
	
}

exports.getNumQuestions = function(req,res) {
	var selected = req.body.testDomain;
	req.session.domainsSelected=selected;
	req.session.questsIds=data.getIds(selected);
	req.session.numQuestions=req.session.questsIds.length;
	var max=req.session.numQuestions;
	res.render('dashboard',{title: 'Tableau de Bord - Chteumeulearn', maxQuestions :max});
	
}


exports.results = function(req,res) {
	res.render('results', { title: 'Resultats - Chteumeulearn'});
}