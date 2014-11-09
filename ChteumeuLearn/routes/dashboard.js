var data = require('../lib/data');

/*
 * GET dashboard page.
 */

exports.dashboard = function(req,res){
	res.render('dashboard', { title: 'Tableau de Bord - Chteumeulearn'});
};

exports.questionTest = function(req,res) {
	var questionExam = data.getRandomQuestionInData();
	res.render('questionTest', { title: 'Test Rapide - Chteumeulearn', randomQuestionTest : questionExam});
}

exports.selectExam = function(req,res) {
	var selected = req.body.testDomain;
	req.session.domainsSelected=selected;
	req.session.questsIds=data.getIds(selected);
	req.session.numQuestions=req.session.questsIds.length;
	res.redirect('/questionExam');
}

exports.questionExam = function(req,res) {
	console.log(req.session.questsIds.length);
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
	console.log(req.body.answer);
	console.log(req.session.actualQuestion.correct);
	if(req.body.answer == req.session.actualQuestion.correct){
		
	}
	else{
		console.log("la cagaste!!");
	}
	var question = req.session.actualQuestion;
	var correct = question.correct;
	var checked = req.body.answer;
	res.render("questionExam", { title: 'Examen - Chteumeulearn',randomQuestionExam:question , correct: correct, checkedAnswer: checked, method:"GET",button:"Suivant"});
	
}


exports.results = function(req,res) {
	res.render('results', { title: 'Resultats - Chteumeulearn'});
}