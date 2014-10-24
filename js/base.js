		$(document).ready(loadSite);
		
        // On page load
		function loadSite() {
			$('.header').load("header.html");
			$('.footer').load("footer.html"); 
			$( "#domainSelect" ).change(onDomainSelectChanged);
			$("#questionCount").change(onQuestionCountChanged);
			var url = window.location.pathname.split("/");
			if(url[url.length-1] === 'questionExam.html' && sessionStorage.getItem("checked")==='no' ){
				newQuestion();
			}
			else if(url[url.length-1] === 'questionExam.html' && sessionStorage.getItem("checked") ==='yes'){
				reloadQuestion(sessionStorage.getItem("actualQuestion"));
			}
		};

        // DASHBOARD

        // Get all questions available for current domains choice
        function onDomainSelectChanged(){
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
        };

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
            $("#questionCount").val(0);
            getQuestionCount($("#questionCount"));
        }

        // EXAM

        // Display a random question and its answers
		function newQuestion(){
			var question = "";
			var questionList = [];
			questionList = JSON.parse(sessionStorage.getItem("questions"));
			var random = Math.floor(Math.random()* questionList.length);
			question = questionList[random];
			sessionStorage.setItem("actualQuestion",question);
			questionList.splice(random,1);
			writeAnswers(question);
			sessionStorage.setItem("questions",JSON.stringify(questionList));
			$(".nextQuestionExam").submit(function(){
					sessionStorage.setItem("checkedRadio",$(".nextQuestionExam input[name=answer]:checked").attr("id"));
					sessionStorage.setItem("checked", 'yes');
					$('.nextQuestionExam').attr('action', underline());
					if(questionList.length == 0){
						$('.nextQuestionExam').attr('action', "results.html");
					}
					
			})
				
		};

		function writeAnswers(question){
			var answers="";
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

		function reloadQuestion(question){
			writeAnswers(question);
			var radioNumber = sessionStorage.getItem("checkedRadio");
			$("#"+radioNumber).attr("checked",'checked');
			var idCorrect = $(".nextQuestionExam input[value = correct]").attr('id');
			$('#nextQuestion').text('Suivant');
			$('#answers'+idCorrect).css({'text-decoration':'underline', 'color':'green'});
			var questionList = JSON.parse(sessionStorage.getItem("questions"));
			$(".nextQuestionExam").submit(function(){
					sessionStorage.setItem("checked", 'no');
					if(questionList.length == 0){
						$('.nextQuestionExam').attr('action', "results.html");
					}	
			})
		};
