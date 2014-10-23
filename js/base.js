		$(document).ready(loadSite);
		
		function loadSite() {
			$('.header').load("header.html");
			$('.footer').load("footer.html"); 
			$( "#formSelect" ).change(getQuestionExam);
			$("#questionNumber").change(getQuestionNumber);
			var url = window.location.pathname.split("/");
			if(url[url.length-1] === 'questionExam.html' && sessionStorage.getItem("checked")==='no' ){
				newQuestion();
			}
			else if(url[url.length-1] === 'questionExam.html' && sessionStorage.getItem("checked") ==='yes'){
				reloadQuestion(sessionStorage.getItem("actualQuestion"));
			}
		};


		function getSelected(){
			var str = [];
			$('#formSelect option:selected').each(function(){
				str.push($(this).text());			
			})
			sessionStorage.setItem("options", JSON.stringify(str));
		};

		function getQuestionNumber(){
			sessionStorage.setItem("questionNumber", $(this).val());
		};

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
