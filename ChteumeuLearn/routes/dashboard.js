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
		var index = req.session.questsIds.indexOf(randomQuestion.id);
		newIds.splice(index,1);
		res.render('questionExam', { title: 'Examen - Chteumeulearn', randomQuestionExam : randomQuestion});
	}
	else{
		res.redirect('/results');
	}
	
}


exports.results = function(req,res) {
	res.render('results', { title: 'Resultats - Chteumeulearn'});
}