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
			questionList = JSON.parse(sessionStorage.getItem("questions"));
			
			if(questionList.length != 0){
				var random = Math.floor(Math.random()* questionList.length);
				question = questionList[random];
				questionList.splice(random,1);
				sessionStorage.setItem("questions",JSON.stringify(questionList));
			$('.questionExam').text(question);
			}
			else{
				location.href = "results.html";
			}

		};