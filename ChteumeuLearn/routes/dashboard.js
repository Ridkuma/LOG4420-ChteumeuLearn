/*
 * GET dashboard page.
 */

exports.dashboard = function(req,res){
	res.render('dashboard', { title: 'Tableau de Bord - Chteumeulearn'});
};

exports.questionTest = function(req,res) {
	res.render('questionTest', { title: 'Test Rapide - Chteumeulearn'});
}

exports.questionExam = function(req,res) {
	res.render('questionExam', { title: 'Examen - Chteumeulearn'});
}