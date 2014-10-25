		$(document).ready(loadSite);
		
        // On page load
		function loadSite() {
			$('.header').load("header.html");
			$('.footer').load("footer.html"); 

			$("#domainSelect").change(onDomainSelectChanged);
			$("#questionCount").change(onQuestionCountChanged);

			var url = window.location.pathname.split("/");
            var location = url[url.length-1];
            if (location.indexOf('dashboard') != -1) {
                defaultForm();
            } 
            else if(location.indexOf('questionExam') != -1) { 
                switch (sessionStorage.getItem("checked")) {
                    case 'no' :
                        newQuestion();
                        break;
                    case 'yes' :
                        reloadQuestion(sessionStorage.getItem("actualQuestion"));
                        break;
                    default :
                        break;
                }
                progress();
            }
            else if(location.indexOf('question') != -1){
                testForm();
            }
		};

        // DASHBOARD

        // Set the form to have default values
        function defaultForm() {
            changeDomain();
            sessionStorage.setItem("right","false");
            sessionStorage.setItem('numQuestionsTest',0);
            sessionStorage.setItem('rightTestAnswers',0);
            sessionStorage.setItem('currentQuestion', 0);
            sessionStorage.setItem('score', 0);
        }

        // On domain selection change
        function onDomainSelectChanged(){
            changeDomain();
        };

        // Get all questions available for current domains choice
        function changeDomain() {
            sessionStorage.setItem("numQuestions",0);
            sessionStorage.setItem("checked", 'no');
            getSelected();
            var questions = [];
            var domains = JSON.parse(sessionStorage.getItem("options"));
            for(i=0;i<data.length;i++){
                if(domains.indexOf(data[i].domain) != -1){
                    questions.push(data[i].question);
                }
            }   
            sessionStorage.setItem("questions",JSON.stringify(questions));

            $('#questionCount').attr('max', questions.length);
            $('#maxQuestionCount').text(questions.length);
            resetQuestionCount();
        }

        // Get selected options for question domain
		function getSelected(){
			var str = [];
			$('#domainSelect option:selected').each(function(){
				str.push($(this).text());			
			})
			sessionStorage.setItem("options", JSON.stringify(str));
		};

        // On question count slider change
        function onQuestionCountChanged() {
            getQuestionCount( $(this) );
        }

        // Store question count choice, update text
        function getQuestionCount(qCount){
            sessionStorage.setItem("questionCount", qCount.val());
            $('#selectedQuestionCount').text(qCount.val());
        };

        // Sets question count back to 0
        function resetQuestionCount() {
            $("#questionCount").val($("#questionCount").attr('min'));
            getQuestionCount($("#questionCount"));
        }

        // EXAM
		function getQuestionExam(){
			sessionStorage.setItem("checked", 'no');
			getSelected();
			var questions = [];
			var domains = JSON.parse(sessionStorage.getItem("options"));
			for(i=0;i<data.length;i++){
				if(domains.indexOf(data[i].domain) != -1){
					questions.push(data[i].question);
				}
			}	
			sessionStorage.setItem("questions",JSON.stringify(questions));
		};

        // Display a random question
		function newQuestion(){
			var numQuestions = parseInt(sessionStorage.getItem("numQuestions"));
			numQuestions++;
			sessionStorage.setItem("numQuestions", numQuestions);
			var question = "";
			var questionList = [];
			questionList = JSON.parse(sessionStorage.getItem("questions"));
			var random = Math.floor(Math.random()* questionList.length);
			question = questionList[random];
			sessionStorage.setItem("actualQuestion",question);
			questionList.splice(random,1);
            sessionStorage.setItem("questions",JSON.stringify(questionList));
            sessionStorage.currentQuestion++;

			writeAnswers(question);

			$(".nextQuestionExam").submit(function(){
					sessionStorage.setItem("checkedRadio",$(".nextQuestionExam input[name=answer]:checked").attr("id"));
					sessionStorage.setItem("checked", 'yes');
					$('.nextQuestionExam').attr('action', underline());
					if(questionList.length == 0){
						$('.nextQuestionExam').attr('action', "results.html");
					}
                })	
		};

        // Display a question's answers
		function writeAnswers(question){
			for(i = 0; i < data.length; i++){
				if(question == data[i].question){
					for(j=0; j< data[i].answers.length;j++){
						answer = data[i].answers[j];
						$(".nextQuestionExam").prepend(" <br/><input type='radio' name ='answer' id = '"+j+"'value='incorrect'><span id = 'answers"+j+"'></></input>");
						$("#answers"+j).text(answer);
						if(j === data[i].correct){
							$('#' + j).val('correct');
						} 
					}
				}
			}
			$('.questionExam').text(question);
		};

        // Correct user answer
		function reloadQuestion(question){
			writeAnswers(question);

			var radioNumber = sessionStorage.getItem("checkedRadio");
			$("#"+radioNumber).attr("checked",'checked');
			var idCorrect = $(".nextQuestionExam input[value = correct]").attr('id');
            $('#answers'+idCorrect).css({'text-decoration':'underline', 'color':'green'});

            if (radioNumber == idCorrect) {
                sessionStorage.score++;
            } else {
                $('#answers'+radioNumber).css({'text-decoration':'underline', 'color':'red'});
            }

			var questionList = JSON.parse(sessionStorage.getItem("questions"));
			var limit = parseInt(sessionStorage.getItem("questionCount"));
			var max = parseInt(sessionStorage.getItem("numQuestions"));
            if(limit == max){
                $('#nextQuestion').text('Terminé');
            }
            else{
                $('#nextQuestion').text('Suivant');
            }
            putPin($('#nextQuestion'));
			$(".nextQuestionExam").submit(function(){
					sessionStorage.setItem("checked", 'no');
					if(questionList.length === 0 || limit === max){
						$('.nextQuestionExam').attr('action', "results.html");
					}	
			})
		};

        //Pin in buttion

        function putPin(id){
            id.append("<img src = 'style/img/pin.png'>");
        }

        // Update progress bar
        function progress() {
            $("#examProgress").attr('max', sessionStorage.getItem("questionCount"));
            $("#examProgress").val(sessionStorage.currentQuestion - 1);
            $("#currentScore").text(sessionStorage.score);
            $("#maxScore").text(sessionStorage.currentQuestion);
        }

        //Test

        function testForm(){
            loadQuestionTest();
        };

        //Choose random question

        function loadQuestionTest(){
            var numQuestionsTest = parseInt(sessionStorage.getItem("numQuestionsTest"));
            numQuestionsTest++;
            sessionStorage.setItem("numQuestionsTest",numQuestionsTest);
            var index = Math.floor(Math.random()*data.length);
            var question = data[index].question;
            var domain = data[index].domain;
            $("#questionTest").text(question);
            $("#testDomain").text(domain);
            var numQuestionsAnswered = parseInt(sessionStorage.getItem("numQuestionsTest"));
            numQuestionsAnswered -= 1;
            $("#result").text("Note actuelle : "+ sessionStorage.getItem("rightTestAnswers")+"/" + numQuestionsAnswered);
            loadAnswersTest(data[index]);
        };

        function loadAnswersTest(question){
            for(i=0;i<question.answers.length;i++){
                var answer = question.answers[i];
                $(".nextQuestionTest").prepend(" <br/><input type='radio' name ='answer' id = '"+i+"'value='incorrect'><span id = 'answers"+i+"'></></input>");
                $("#answers"+i).text(answer);
            }
            var correct = question.correct;
            $(".nextQuestionTest").change(function(){
                var idChecked = $(".nextQuestionTest input[name=answer]:checked").attr("id");
                checkAnswer(correct,idChecked);
            });
            $(".nextQuestionTest").submit(refreshResult());
        };
                
        function checkAnswer(correct,idChecked){
            if(parseInt(idChecked) === parseInt(correct)){
                sessionStorage.setItem("right","true");
            }
            else{
                sessionStorage.setItem("right","false");
            }
        };

        function refreshResult(){
            var checked = sessionStorage.getItem("right");
            if(checked === "true"){
                sessionStorage.getItem("right","false");
                var right = parseInt(sessionStorage.getItem("rightTestAnswers"));
                right++;
                sessionStorage.setItem("rightTestAnswers",right);
                var numQuestionsAnswered = parseInt(sessionStorage.getItem("numQuestionsTest"));
                numQuestionsAnswered -= 1;
                $("#result").text("Note actuelle : "+ sessionStorage.getItem("rightTestAnswers")+"/" + numQuestionsAnswered);
            }
        };
