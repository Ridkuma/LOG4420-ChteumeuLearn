var data = require('../lib/data');
var questionSchema = new data.Schema({
  id: {type: Number, unique:true},
  domain: String,
  question: String,
  answers: [String],
  correct: Number
})
var Question = db.mongoose.model('Question', questionSchema);
// Add user to database
exports.addQuestion = function addQuestion(question, answers,correct,domain, callback) {
  var instance = new Question();
  instance.question = question;
  instance.answers = answers;
  instance.correct = correct;
  instance.domain = domain;

  instance.save(function (err) {
  if (err) {
      callback(err);
  }
  else {
      callback(null, instance);
  }
  }); 
}