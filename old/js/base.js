        $(document).ready(loadSite);
        
        // On page load
        function loadSite() {
            $('.header').load("header.html");
            $('.footer').load("footer.html"); 

            var url = window.location.pathname.split("/");
            var location = url[url.length-1];

            // On dashboard
            if (location.indexOf('dashboard') != -1) {
                $("#domainSelect").change(onDomainSelectChanged);
                $("#questionCount").change(onQuestionCountChanged);
                $("#resetStats").click(onResetButtonClicked);
                defaultForm();
                updateExamStats();
                updateDetails();
            } 
            // On exam
            else if(location.indexOf('questionExam') != -1) {
                updateStats("rightTestAnswers","rightQuestionTest");
                updateStats("numQuestionsTest","totalQuestionTest");
                updateExamStats();
                if (sessionStorage.checked === "false") {
                    newQuestion();
                } else {
                    reloadQuestion(sessionStorage.actualQuestion);
                } 
                $("#forfeitExam").click(onForfeitExamClicked);
                progress("exam");
            }
            // On quick test
            else if(location.indexOf('question') != -1){
                //updateStats("rightTestAnswers","rightQuestionTest");
                //updateStats("numQuestionsTest","totalQuestionTest");
                updateExamStats();
                updateTestStats();
                testForm();
            }
            // On results
            else if (location.indexOf('results') != -1) {
                updateFinalResult();
                recordResults();    
            }
        };

        // DASHBOARD

        // Set the form to have default values
        function defaultForm() {
            changeDomain();
            //updateStats("rightTestAnswers","rightQuestionTest");
            //updateStats("numQuestionsTest","totalQuestionTest");
            updateTestStats();
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
                if(localStorage.getItem(fixed) === null){
                    localStorage.setItem(fixed,sessionStorage.getItem(actual));
                }
                else{
                    var totalData = parseInt(sessionStorage.getItem(actual)) + parseInt(localStorage.getItem(fixed));
                    localStorage.setItem(fixed,totalData);
                }
                if(typeof(localStorage.rightQuestionTest) != undefined){
                    var result = localStorage.rightQuestionTest;
                }
                else{
                    var result = 0;
                }
                $("#testStats").text("Note cumulative tests : "+ result + "/" + localStorage.totalQuestionTest);  
            }
        };

        // Updates exam count displayed
        function updateExamStats(){
            if (localStorage.examResults == "" || localStorage.examResults == undefined) {
                $("#examCount").text("0");
            } else {
                $("#examCount").text(JSON.parse(localStorage.examResults).length);
            }
            var average = examAverage();
            if (average != -1) {
                $("#examCount").append("<br/> Moyenne des examens : " + average + "%");
            }
        }

        // Updates test data displayed
        function updateTestStats(){
            if (localStorage.rightQuestionTest == "" || localStorage.rightQuestionTest == undefined) {
                localStorage.rightQuestionTest = 0;
            }

            if (localStorage.totalQuestionTest == "" || localStorage.totalQuestionTest == undefined) {
                localStorage.totalQuestionTest = 0;
            }

            $("#testStats").text("Note cumulative tests : "+ localStorage.rightQuestionTest + "/" + localStorage.totalQuestionTest);
        }

        // Updates Details modal content table
        function updateDetails() {
            if (localStorage.examResults == "" || localStorage.examResults == undefined) {
                return;
            }
            var table = $("#details #detailsTable");
            var results = JSON.parse(localStorage.examResults);
            for (var i = results.length - 1; i >= 0; i--) {
                var $row = $("<tr/>").appendTo(table);
                $row.append("<td>" + (i + 1) + "</td>");
                $row.append("<td>" + results[i].score + "/" + results[i].maxScore + "</td>");
                var domains = "";
                for (var j = results[i].domains.length - 1; j >= 0; j--) {
                    domains += results[i].domains[j] + ", ";
                };
                domains = domains.slice(0, -2);
                $row.append("<td>" + domains + "</td>");
            };
        }

        function examAverage() {
            if (localStorage.examResults == "" || localStorage.examResults == undefined) {
                return -1;
            }
            var sum = 0;
            var results = JSON.parse(localStorage.examResults);
            for (var i = results.length - 1; i >= 0; i--) {
                sum += (parseInt(results[i].score)/parseInt(results[i].maxScore)) * 100;
            }
            sum /= results.length;
            return Math.floor(sum);
        }

        // On Remise a Zero button clicked
        function onResetButtonClicked() {
            resetStats();
            window.location.reload();
        }

        // Destroy all saved results
        function resetStats() {
            localStorage.examResults = [];
            localStorage.rightQuestionTest = 0;
            localStorage.totalQuestionTest = 0;
        }

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
                    if(questionList.length === 0 && $('#buttonNext').text() === "Terminé"){
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
            if (radioNumber === idCorrect) {
                sessionStorage.score++;
            } else {
                $('#answers'+radioNumber).css({'text-decoration':'underline', 'color':'red'});
            }

            var questionList = JSON.parse(sessionStorage.questions);
            var limit = sessionStorage.questionCount;
            var max = sessionStorage.numQuestions;
            if(limit === max){
                $('#buttonNext').text('Terminé');
            }
            else{
                $('#buttonNext').text('Suivant');
            }
            putPin($('#buttonNext'));
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
            var index = Math.floor(Math.random()*data.length);
            $("#questionTest").text(data[index].question);
            $("#testDomain").text(data[index].domain);
            $("#result").text("Note actuelle : "+ sessionStorage.rightTestAnswers+"/" + sessionStorage.numQuestionsTest);
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
            sessionStorage.numQuestionsTest++;
            localStorage.totalQuestionTest++;
            if(sessionStorage.right == "true"){
                sessionStorage.rightTestAnswers = (parseInt(sessionStorage.rightTestAnswers)) + 1;
                localStorage.rightQuestionTest++;
                $("#result").text("Note actuelle : "+ sessionStorage.rightTestAnswers +"/" + (sessionStorage.numQuestionsTest - 1));
            }
        };

        // RESULTS

        function updateFinalResult(){
            var percent = (parseInt(sessionStorage.score)/parseInt(sessionStorage.numQuestions))*100;
            var message = ""
            if(percent < 25){
                message = "Il faut étudier beaucoup plus !";    
            }
            if(percent >= 25 && percent < 50){
                message = "Presque à la moyenne, un peu plus d'effort !";    
            }
            if(percent >= 50 && percent < 75){
                message = "Sur la moyenne, bon travail mais tu peux améliorer !";    
            }
            if(percent >= 75){
                message = "Super ! Continue comme ça !";    
            }
            $("#finalResult").text("Note Finale: " + percent + "%." );
            $("#finalResult").append("<br/>" + message);
        };

        // Record user results in a cookie
        function recordResults() {
            var results;
            if (localStorage.examResults == "" || localStorage.examResults == undefined) {
                results = [];
            } else {
                results = JSON.parse(localStorage.examResults);    
            }
            results.push({"score" : sessionStorage.score, 
                        "maxScore" : sessionStorage.questionCount, 
                        "domains" : JSON.parse(sessionStorage.options)
            });
            localStorage.examResults = JSON.stringify(results);
        };