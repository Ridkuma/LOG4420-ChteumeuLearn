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
                if (sessionStorage.checked === "false") {
                    newQuestion();
                } else {
                    reloadQuestion(sessionStorage.actualQuestion);
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
            sessionStorage.idChecked = null;
            $("#finalTestButton").attr("disabled", true);
            sessionStorage.right = false;
            sessionStorage.numQuestionsTest = 0;
            sessionStorage.rightTestAnswers = 0;
            sessionStorage.currentQuestion = 0;
            sessionStorage.score = 0;
        };

       function updateStats(actual,fixed){
            if(sessionStorage.getItem(actual) != null){
                    if(sessionStorage.getItem(fixed) === null){
                        sessionStorage.setItem(fixed,sessionStorage.getItem(actual));
                    }
                    else{
                        var totalData = parseInt(sessionStorage.getItem(actual)) + parseInt(sessionStorage.getItem(fixed));
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
            sessionStorage.numQuestions = 0;
            sessionStorage.checked = "false";
            getSelected();
            var domains = JSON.parse(sessionStorage.options);
            var questions = [];
            getQuestionsAvailable(domains,questions);
            sessionStorage.questions = JSON.stringify(questions);
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
			sessionStorage.options = JSON.stringify(str);
		};

        // On question count slider change
        function onQuestionCountChanged() {
            getQuestionCount( $(this) );
            $("#finalTestButton").attr("disabled", false);
        };

        // Store question count choice, update text
        function getQuestionCount(qCount){
            sessionStorage.questionCount = qCount.val();
            $('#selectedQuestionCount').text(qCount.val());
        };

        // Sets question count back to 0
        function resetQuestionCount() {
            $("#questionCount").val($("#questionCount").attr('min'));
            getQuestionCount($("#questionCount"));
        };

        // EXAM
		function getQuestionExam(){
			sessionStorage.checked = "false";
			getSelected();
			var questions = [];
			var domains = JSON.parse(sessionStorage.options);
			for(i=0;i<data.length;i++){
				if(domains.indexOf(data[i].domain) != -1){
					questions.push(data[i].question);
				}
			}	
			sessionStorage.questions = JSON.stringify(questions);
		};

        // Display a random question
		function newQuestion(){
			sessionStorage.numQuestions++;
			var questionList = JSON.parse(sessionStorage.questions);
			var randPick = Math.floor(Math.random()* questionList.length);
			var questionId = questionList[randPick];
			sessionStorage.actualQuestion = questionId;

			questionList.splice(randPick,1);
            sessionStorage.questions = JSON.stringify(questionList);
            sessionStorage.currentQuestion++;
            $('.questionExam').text(data[questionId].question);
			writeAnswers(questionId);

			$("#nextQuestionExam").submit(function(){
					sessionStorage.checkedRadio = $("#nextQuestionExam input[name=answer]:checked").attr("id");
					sessionStorage.checked = "true";
					// $('#nextQuestionExam').attr('action', underline());
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
		function reloadQuestion(questionId){
            $('.questionExam').text(data[questionId].question);
			writeAnswers(questionId);
			var radioNumber = sessionStorage.checkedRadio;
			$("#"+radioNumber).attr("checked",'checked');
			var idCorrect = $("#nextQuestionExam input[value = correct]").attr('id');
            $('#answers'+idCorrect).css({'text-decoration':'underline', 'color':'green'});

            // Increment score if correct, else show error
            if (radioNumber == idCorrect) {
                sessionStorage.score++;
            } else {
                $('#answers'+radioNumber).css({'text-decoration':'underline', 'color':'red'});
            }

			var questionList = JSON.parse(sessionStorage.questions);
			var limit = sessionStorage.questionCount;
			var max = sessionStorage.numQuestions;
            if(limit == max){
                $('#buttonNext').text('Terminé');
            }
            else{
                $('#buttonNext').text('Suivant');
            }
            putPin($('#nextQuestion'));
			$("#nextQuestionExam").submit(function(){
					sessionStorage.checked = "false";
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
                $("#examProgress").attr('max', sessionStorage.questionCount);
                $("#examProgress").val(sessionStorage.currentQuestion - 1);
            }
            $("#currentScore").text(sessionStorage.score);
            $("#maxScore").text((testType == "exam") ? sessionStorage.questionCount : sessionStorage.currentQuestion);
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
            sessionStorage.right = "false";
            sessionStorage.numQuestionsTest++;
            var index = Math.floor(Math.random()*data.length);
            $("#questionTest").text(data[index].question);
            $("#testDomain").text(data[index].domain);
            var numQuestionsAnswered = sessionStorage.numQuestionsTest;
            numQuestionsAnswered--;
            $("#result").text("Note actuelle : "+ sessionStorage.rightTestAnswers+"/" + numQuestionsAnswered);
            writeAnswers(index);
            sessionStorage.index = index;
            $("#nextQuestionTest").change(getChecked);
            $("#nextQuestionTest").submit(refreshResult);
            $("#backToMenu").click(refreshStatistics);
        };

        function getChecked(){
            var idChecked = $("#nextQuestionTest input[name=answer]:checked").attr("id");
            sessionStorage.idChecked = idChecked;
            sessionStorage.right = (parseInt(idChecked) === data[sessionStorage.index].correct);
        };

        function refreshStatistics(){
            if(sessionStorage.right === "true"){
                sessionStorage.rightTestAnswers = (parseInt(sessionStorage.rightTestAnswers)) + 1;
            }
        };
 

        function refreshResult(){
            if(sessionStorage.right == "true"){
                sessionStorage.rightTestAnswers = (parseInt(sessionStorage.rightTestAnswers)) + 1;
                var numQuestionsAnswered = sessionStorage.numQuestionsTest;
                numQuestionsAnswered--;
                $("#result").text("Note actuelle : "+ sessionStorage.rightTestAnswers +"/" + numQuestionsAnswered);
            }
        };

        // Record user results in a cookie
        function recordResults() {
            var results;
            if (localStorage.examResults == null) {
                results = [];
            } else {
                results = JSON.parse(localStorage.examResults);    
            }
            results.push({"score" : sessionStorage.score, 
                        "maxScore" : sessionStorage.questionCount, 
                        "domain" : JSON.parse(sessionStorage.options)
            });
            localStorage.examResults = JSON.stringify(results);
            // TODO
        };