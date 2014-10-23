		$(document).ready(loadSite);
		
		function loadSite() {
			$('.header').load("header.html");
			$('.footer').load("footer.html"); 
			$( "#formSelect" ).change(getQuestionExam);
			$("#questionNumber").change(getQuestionNumber);
			var url = window.location.pathname.split("/");
			if(url[url.length-1] === 'questionExam.html'){
				putQuestion();
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

		function putQuestion(){
			var question = "";
			var questionList = [];
			var answers=[];
			questionList = JSON.parse(sessionStorage.getItem("questions"));
			var random = Math.floor(Math.random()* questionList.length);
			question = questionList[random];
			for(i = 0; i < data.length; i++){
				if(question == data[i].question){
					for(j=0; j< data[i].answers.length;j++){
						answers[j]= data[i].answers[j];
					}
				}
			}
			for(m = 0; m<answers.length;m++){
				alert(answers[m]);
				alert(m);
				$("#answer"+ m).text(answers[m]);
				if(m != answers.length-1){
					var next = m+1;
					$("#answer"+m).after(" <br/><input type='radio' name='answer' value='answer1'><span id = 'answer"+ next +"'></></input>");
				}
			}
			questionList.splice(random,1);
			sessionStorage.setItem("questions",JSON.stringify(questionList));
			$('.questionExam').text(question);
			$(".nextQuestionExam").submit(function(){
					if(questionList.length == 0){
						$('.nextQuestionExam').attr('action', "results.html");
					}
					
			})
				
		};
