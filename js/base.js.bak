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
                $("#forfeitExam").click(onForfeitExamClicked);
                progress("exam");
            }
            else if(location.indexOf('question') != -1){
                testForm();
            }
            else if (location.indexOf('results') != -1) {
                recordResults();    
            }
		};

        // DASHBOARD

        // Set the form to have default values
        function defaultForm() {
            changeDomain();
            updateStats("rightTestAnswers","rightQuestionTest");
            updateStats("numQuestionsTest","totalQuestionTest");
            sessionStorage.setItem("idChecked",null);
            $("#finalTestButton").attr("disabled", true);
            sessionStorage.setItem("right","false");
            sessionStorage.setItem('numQuestionsTest',0);
            sessionStorage.setItem('rightTestAnswers',0);
            sessionStorage.setItem('currentQuestion', 0);
            sessionStorage.setItem('score', 0);
        };

       function updateStats(actual,fixed){
            if(sessionStorage.getItem(actual) != null){
                    if(sessionStorage.getItem(fixed) === null){
                        sessionStorage.setItem(fixed,sessionStorage.getItem(actual));
                    }
                    else{
                        var newData = parseInt(sessionStorage.getItem(actual));
                        var pastData = parseInt(sessionStorage.getItem(fixed));
                        var totalData = newData + pastData;
                        sessionStorage.setItem(fixed,totalData);
                    }
                    if(typeof(sessionStorage.rightQuestionTest) != undefined){
                        var result = sessionStorage.rightQuestionTest
                    }
                    else{
                        var result = 0;
                    }
                    $("#testStats").text("Note acumulative tests : "+ result + "/" + sessionStorage.totalQuestionTest);  
            }
        };
        // On domain selection change
        function onDomainSelectChanged(){
            changeDomain();
        };

        // Get all questions available for current domains choice
        function changeDomain() {
            sessionStorage.setItem("numQuestions",0);
            sessionStorage.setItem("checked", 'no');
            getSelected();
            var domains = JSON.parse(sessionStorage.getItem("options"));
            var questions = []
            getQuestionsAvailable(domains,questions);
            sessionStorage.setItem("questions",JSON.stringify(questions));
            $('#questionCount').attr('max', questions.length);
            $('#maxQuestionCount').text(questions.length);
            resetQuestionCount();
        };

        function getQuestionsAvailable(compare,fill){
            for(i=0;i<data.length;i++){
                if(compare.indexOf(data[i].domain) != -1){
                    fill.push(i);
                }
            }
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
            $("#finalTestButton").attr("disabled", false);
        };

        // Store question count choice, update text
        function getQuestionCount(qCount){
            sessionStorage.setItem("questionCount", qCount.val());
            $('#selectedQuestionCount').text(qCount.val());
        };

        // Sets question count back to 0
        function resetQuestionCount() {
            $("#questionCount").val($("#questionCount").attr('min'));
            getQuestionCount($("#questionCount"));
        };

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
			var questionId = "";
			var questionList = [];
			questionList = JSON.parse(sessionStorage.getItem("questions"));
			var random = Math.floor(Math.random()* questionList.length);
			questionId = questionList[random];
			sessionStorage.setItem("actualQuestion",questionId);
			questionList.splice(random,1);
            sessionStorage.setItem("questions",JSON.stringify(questionList));
            sessionStorage.currentQuestion++;
            $('.questionExam').text(data[questionId].question);
			writeAnswers(questionId);

			$("#nextQuestionExam").submit(function(){
					sessionStorage.setItem("checkedRadio",$("#nextQuestionExam input[name=answer]:checked").attr("id"));
					sessionStorage.setItem("checked", 'yes');
					$('#nextQuestionExam').attr('action', underline());
					if(questionList.length == 0){
						$('#nextQuestionExam').attr('action', "results.html");
					}
            })	
		};

        // Display a question's answers
		function writeAnswers(questionId){
            for(j=0; j< data[questionId].answers.length;j++){
                answer = data[questionId].answers[j];
                $(".nextQuestion").prepend(" <br/><input type='radio' name ='answer' id = '"+j+"'value='incorrect'><span id = 'answers"+j+"'></></input>");
                $("#answers"+j).text(answer); 
            }
                var correctIndex = data[questionId].correct;
                $('#' + correctIndex).val('correct');
        };

        // Correct user answer
		function reloadQuestion(question){
            $('.questionExam').text(data[question].question);
			writeAnswers(question);
			var radioNumber = sessionStorage.getItem("checkedRadio");
			$("#"+radioNumber).attr("checked",'checked');
			var idCorrect = $("#nextQuestionExam input[value = correct]").attr('id');
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
                $('#buttonNext').text('Terminé');
            }
            else{
                $('#buttonNext').text('Suivant');
            }
            putPin($('#nextQuestion'));
			$("#nextQuestionExam").submit(function(){
					sessionStorage.setItem("checked", 'no');
					if(questionList.length === 0 || limit === max){
						$('#nextQuestionExam').attr('action', "results.html");
					}	
			})
		};

        //Pin in buttion

        function putPin(id){
            id.append("<img src = 'style/img/pin.png'>");
        };

        // Update progress bar
        function progress(testType) {
            if (testType == "exam") {
                $("#examProgress").attr('max', sessionStorage.getItem("questionCount"));
                $("#examProgress").val(sessionStorage.currentQuestion - 1);
            }
            $("#currentScore").text(sessionStorage.score);
            $("#maxScore").text((testType == "exam") ? sessionStorage.getItem("questionCount") : sessionStorage.currentQuestion);
        };

        // On Abandonner button clicked
        function onForfeitExamClicked() {
            var forfeit = confirm("Etes-vous sur(e) de vouloir abandonner ?");
            if (forfeit) {
                sessionStorage.score = 0;
                window.location.replace("results.html");
            }
        };

        //Test

        function testForm(){
            loadQuestionTest();
        };

        //Choose random question

        function loadQuestionTest(){
            sessionStorage.setItem("right","false");
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
            writeAnswers(index);
            sessionStorage.setItem("index",index);
            $("#nextQuestionTest").change(getChecked);
            $("#nextQuestionTest").submit(refreshResult);
            $("#backToMenu").click(refreshStatistics);
            
            
        };

        function getChecked(){
            var idChecked = $("#nextQuestionTest input[name=answer]:checked").attr("id");
            sessionStorage.setItem("idChecked",idChecked);
            if(parseInt(idChecked) === data[parseInt(sessionStorage.getItem("index"))].correct){
                sessionStorage.setItem("right","true");
            }
            else{
                sessionStorage.setItem("right","false");
            }
        };

        function refreshStatistics(){
            if(sessionStorage.getItem("right") === "true"){
                var right = parseInt(sessionStorage.getItem("rightTestAnswers"));
                right++;
                sessionStorage.setItem("rightTestAnswers",right);
            }
        };
 

        function refreshResult(){
            if(sessionStorage.getItem("right") === "true"){
                var right = parseInt(sessionStorage.getItem("rightTestAnswers"));
                right++;
                sessionStorage.setItem("rightTestAnswers",right);
                var numQuestionsAnswered = parseInt(sessionStorage.getItem("numQuestionsTest"));
                numQuestionsAnswered -= 1;
                $("#result").text("Note actuelle : "+ sessionStorage.getItem("rightTestAnswers")+"/" + numQuestionsAnswered);
            }
        };

        // Record user results in a cookie
        function recordResults() {
            // TODO
        };